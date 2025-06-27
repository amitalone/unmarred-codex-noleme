import { 
  FaceImage, 
  ModelImage, 
  OutputImage 
} from "@repo/shared-interfaces";
import { 
  CombinationMatch, 
  ImageIdentification, 
  GlowConfiguration,
  ColorPalette 
} from "./types";
import { 
  generateCombinationColor, 
  DEFAULT_GLOW_CONFIG,
  DEFAULT_COLOR_PALETTE 
} from "./colorUtils";

/**
 * Creates a unique identifier for a face-model combination
 */
export function createCombinationId(faceName: string, modelName: string): string {
  return `${faceName}--${modelName}`;
}

/**
 * Extracts face and model names from combination filename
 * Expected format: "face_xxx.jpg--model_yyy.png--_00001_.png"
 */
export function parseCombinationName(combinationName: string): {
  faceName: string;
  modelName: string;
} | null {
  const parts = combinationName.split('--');
  if (parts.length < 2) {
    return null;
  }

  const faceName = parts[0];
  const modelName = parts[1];

  // Ensure we have valid names
  if (!faceName || !modelName) {
    return null;
  }

  return { faceName, modelName };
}

/**
 * Converts OutputImage to CombinationMatch with glow configuration
 */
export function createCombinationMatch(
  output: OutputImage,
  colorPalette: ColorPalette = DEFAULT_COLOR_PALETTE,
  baseGlowConfig: Partial<GlowConfiguration> = {}
): CombinationMatch {
  const combinationId = createCombinationId(output.face.name, output.model.name);
  const color = generateCombinationColor(combinationId, colorPalette);
  
  const glowConfig: GlowConfiguration = {
    ...DEFAULT_GLOW_CONFIG,
    ...baseGlowConfig,
    color, // Override color with generated one
  };

  return {
    id: combinationId,
    face: output.face,
    model: output.model,
    output,
    glowConfig,
    created: output.created || new Date().toISOString(),
    createdFmt: output.createdfmt || new Date().toLocaleDateString(),
  };
}

/**
 * Finds all combinations that include a specific image
 */
export function findImageCombinations(
  imageName: string,
  imageType: 'face' | 'model',
  combinations: CombinationMatch[]
): CombinationMatch[] {
  return combinations.filter(combination => {
    if (imageType === 'face') {
      return combination.face.name === imageName;
    } else {
      return combination.model.name === imageName;
    }
  });
}

/**
 * Creates image identification result
 */
export function identifyImage(
  imageName: string,
  imageType: 'face' | 'model',
  combinations: CombinationMatch[]
): ImageIdentification {
  const imageCombinations = findImageCombinations(imageName, imageType, combinations);
  
  return {
    imageName,
    imageType,
    combinations: imageCombinations,
    hasMatches: imageCombinations.length > 0,
  };
}

/**
 * Processes all existing combinations and creates match objects
 */
export function processCombinations(
  existingCombinations: OutputImage[],
  colorPalette: ColorPalette = DEFAULT_COLOR_PALETTE,
  baseGlowConfig: Partial<GlowConfiguration> = {}
): CombinationMatch[] {
  return existingCombinations.map(output => 
    createCombinationMatch(output, colorPalette, baseGlowConfig)
  );
}

/**
 * Groups combinations by their shared images
 */
export function groupCombinationsByImage(
  combinations: CombinationMatch[]
): {
  byFace: Map<string, CombinationMatch[]>;
  byModel: Map<string, CombinationMatch[]>;
} {
  const byFace = new Map<string, CombinationMatch[]>();
  const byModel = new Map<string, CombinationMatch[]>();

  combinations.forEach(combination => {
    // Group by face
    const faceName = combination.face.name;
    if (!byFace.has(faceName)) {
      byFace.set(faceName, []);
    }
    byFace.get(faceName)!.push(combination);

    // Group by model
    const modelName = combination.model.name;
    if (!byModel.has(modelName)) {
      byModel.set(modelName, []);
    }
    byModel.get(modelName)!.push(combination);
  });

  return { byFace, byModel };
}

/**
 * Checks if a specific face-model combination exists
 */
export function combinationExists(
  faceName: string,
  modelName: string,
  combinations: CombinationMatch[]
): boolean {
  const combinationId = createCombinationId(faceName, modelName);
  return combinations.some(combination => combination.id === combinationId);
}

/**
 * Gets the primary glow color for an image if it has combinations
 */
export function getImageGlowColor(
  imageName: string,
  imageType: 'face' | 'model',
  combinations: CombinationMatch[]
): string | null {
  const imageCombinations = findImageCombinations(imageName, imageType, combinations);
  
  if (imageCombinations.length === 0) {
    return null;
  }

  // Return the color of the first combination
  // In case of multiple combinations, this gives a consistent primary color
  return imageCombinations[0]?.glowConfig.color || null;
}

/**
 * Validates combination data structure
 */
export function validateCombinationData(
  combinations: OutputImage[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  combinations.forEach((combination, index) => {
    if (!combination.face || !combination.face.name) {
      errors.push(`Combination ${index}: Missing face data`);
    }
    
    if (!combination.model || !combination.model.name) {
      errors.push(`Combination ${index}: Missing model data`);
    }
    
    if (!combination.name) {
      errors.push(`Combination ${index}: Missing combination name`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
