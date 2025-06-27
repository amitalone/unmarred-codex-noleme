import { useMemo, useCallback } from "react";
import { FaceImage, ModelImage, OutputImage } from "@repo/shared-interfaces";
import { 
  CombinationMatch, 
  GlowConfiguration, 
  ColorPalette,
  GlowStyle,
  ImageIdentification 
} from "./types";
import { 
  processCombinations,
  groupCombinationsByImage,
  identifyImage,
  getImageGlowColor,
  validateCombinationData 
} from "./combinationUtils";
import { 
  createGlowStyles,
  DEFAULT_COLOR_PALETTE,
  DEFAULT_GLOW_CONFIG 
} from "./colorUtils";

/**
 * Hook for managing combination highlighting logic
 */
export function useCombinationHighlighter(
  existingCombinations: OutputImage[],
  selectedFaces: FaceImage[],
  selectedModels: ModelImage[],
  colorPalette: ColorPalette = DEFAULT_COLOR_PALETTE,
  defaultGlowConfig: Partial<GlowConfiguration> = {}
) {
  // Validate and process combinations
  const processedCombinations = useMemo(() => {
    const validation = validateCombinationData(existingCombinations);
    
    if (!validation.isValid && typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
      console.warn('Invalid combination data:', validation.errors);
    }
    
    return processCombinations(existingCombinations, colorPalette, defaultGlowConfig);
  }, [existingCombinations, colorPalette, defaultGlowConfig]);

  // Group combinations by image
  const groupedCombinations = useMemo(() => {
    return groupCombinationsByImage(processedCombinations);
  }, [processedCombinations]);

  // Get image identification for selected faces
  const faceIdentifications = useMemo(() => {
    return selectedFaces.map(face => 
      identifyImage(face.name, 'face', processedCombinations)
    );
  }, [selectedFaces, processedCombinations]);

  // Get image identification for selected models
  const modelIdentifications = useMemo(() => {
    return selectedModels.map(model => 
      identifyImage(model.name, 'model', processedCombinations)
    );
  }, [selectedModels, processedCombinations]);

  // Get glow styles for a specific image
  const getImageGlowStyles = useCallback((
    imageName: string, 
    imageType: 'face' | 'model'
  ): GlowStyle | null => {
    const color = getImageGlowColor(imageName, imageType, processedCombinations);
    
    if (!color) {
      return null;
    }

    const config: GlowConfiguration = {
      ...DEFAULT_GLOW_CONFIG,
      ...defaultGlowConfig,
      color,
    };

    return createGlowStyles(config);
  }, [processedCombinations, defaultGlowConfig]);

  // Check if an image has combinations
  const hasImageCombinations = useCallback((
    imageName: string, 
    imageType: 'face' | 'model'
  ): boolean => {
    const imageMap = imageType === 'face' ? groupedCombinations.byFace : groupedCombinations.byModel;
    return imageMap.has(imageName);
  }, [groupedCombinations]);

  // Get all combinations for a specific image
  const getImageCombinations = useCallback((
    imageName: string, 
    imageType: 'face' | 'model'
  ): CombinationMatch[] => {
    const imageMap = imageType === 'face' ? groupedCombinations.byFace : groupedCombinations.byModel;
    return imageMap.get(imageName) || [];
  }, [groupedCombinations]);

  // Get statistics
  const statistics = useMemo(() => {
    return {
      totalCombinations: processedCombinations.length,
      facesWithCombinations: groupedCombinations.byFace.size,
      modelsWithCombinations: groupedCombinations.byModel.size,
      selectedFacesWithCombinations: faceIdentifications.filter(id => id.hasMatches).length,
      selectedModelsWithCombinations: modelIdentifications.filter(id => id.hasMatches).length,
    };
  }, [processedCombinations, groupedCombinations, faceIdentifications, modelIdentifications]);

  return {
    // Processed data
    combinations: processedCombinations,
    groupedCombinations,
    faceIdentifications,
    modelIdentifications,
    
    // Utility functions
    getImageGlowStyles,
    hasImageCombinations,
    getImageCombinations,
    
    // Statistics
    statistics,
    
    // Raw data for debugging
    rawCombinations: existingCombinations,
  };
}

/**
 * Hook for managing glow animation state
 */
export function useGlowAnimation(
  isEnabled: boolean = true,
  animationDuration: number = 2000
) {
  const getAnimationStyle = useCallback((
    baseStyle: GlowStyle,
    shouldAnimate: boolean = true
  ): React.CSSProperties => {
    if (!isEnabled || !shouldAnimate) {
      return {
        boxShadow: baseStyle.boxShadow,
        border: baseStyle.border,
      };
    }

    return {
      boxShadow: baseStyle.boxShadow,
      border: baseStyle.border,
      animation: baseStyle.animation || `combinationGlow ${animationDuration}ms ease-in-out infinite alternate`,
      transition: 'all 0.3s ease-in-out',
    };
  }, [isEnabled, animationDuration]);

  return { getAnimationStyle };
}
