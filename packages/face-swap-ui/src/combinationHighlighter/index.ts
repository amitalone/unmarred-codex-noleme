// Main components
export { CombinationHighlighter, useCombinationContext } from "./combinationHighlighter";
export { HighlightedFaceImage, HighlightedModelImage } from "./highlightedImages";
export { CombinationStats, CombinationLegend, CombinationDebugPanel } from "./components";

// Hooks
export { useCombinationHighlighter, useGlowAnimation } from "./hooks";

// Types
export type {
  CombinationHighlighterProps,
  CombinationMatch,
  GlowConfiguration,
  ColorPalette,
  GlowStyle,
  ImageIdentification,
} from "./types";

// Utilities
export {
  createCombinationId,
  parseCombinationName,
  createCombinationMatch,
  findImageCombinations,
  identifyImage,
  processCombinations,
  groupCombinationsByImage,
  combinationExists,
  getImageGlowColor,
  validateCombinationData,
} from "./combinationUtils";

export {
  getColorFromPalette,
  generateCombinationColor,
  createGlowStyles,
  generateGlowKeyframes,
  lightenColor,
  darkenColor,
  DEFAULT_COLOR_PALETTE,
  DEFAULT_GLOW_CONFIG,
} from "./colorUtils";

// CSS
//import "./combinationHighlighter.css";
