import { FaceImage, ModelImage, OutputImage } from "@repo/shared-interfaces";

/**
 * Configuration for glow/highlight effect
 */
export interface GlowConfiguration {
  /** Base glow color */
  color: string;
  /** Glow intensity (0-1) */
  intensity: number;
  /** Animation duration in milliseconds */
  animationDuration: number;
  /** Whether to use pulsing animation */
  enablePulse: boolean;
}

/**
 * Represents a face-model combination with glow styling
 */
export interface CombinationMatch {
  /** Unique identifier for the combination */
  id: string;
  /** Face image information */
  face: FaceImage;
  /** Model image information */
  model: ModelImage;
  /** Output image information */
  output: OutputImage;
  /** Glow configuration for this combination */
  glowConfig: GlowConfiguration;
  /** Creation date */
  created: string;
  /** Formatted creation date */
  createdFmt: string;
}

/**
 * Color palette for different combinations
 */
export interface ColorPalette {
  primary: string[];
  secondary: string[];
  accent: string[];
}

/**
 * Props for the CombinationHighlighter component
 */
export interface CombinationHighlighterProps {
  /** List of existing combinations */
  existingCombinations: OutputImage[];
  /** Currently selected faces */
  selectedFaces: FaceImage[];
  /** Currently selected models */
  selectedModels: ModelImage[];
  /** Custom color palette */
  colorPalette?: ColorPalette;
  /** Custom glow configuration */
  defaultGlowConfig?: Partial<GlowConfiguration>;
  /** Callback when combination is highlighted */
  onCombinationHighlight?: (combination: CombinationMatch) => void;
  /** Additional CSS classes */
  className?: string;
  /** Enable debug mode */
  debug?: boolean;
}

/**
 * Return type for glow style calculations
 */
export interface GlowStyle {
  boxShadow: string;
  border?: string;
  animation?: string;
}

/**
 * Image identification result
 */
export interface ImageIdentification {
  imageName: string;
  imageType: 'face' | 'model';
  combinations: CombinationMatch[];
  hasMatches: boolean;
}
