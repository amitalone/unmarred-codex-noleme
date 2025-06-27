"use client";
import React, { useMemo } from "react";
import { FaceImage, ModelImage, OutputImage } from "@repo/shared-interfaces";
import {
  CombinationHighlighterProps,
  ColorPalette,
  GlowConfiguration,
} from "./types";
import { useCombinationHighlighter, useGlowAnimation } from "./hooks";
import {
  DEFAULT_COLOR_PALETTE,
  DEFAULT_GLOW_CONFIG,
  generateGlowKeyframes,
} from "./colorUtils";

// Component for injecting CSS keyframes
const GlowKeyframes: React.FC = () => {
  const keyframes = useMemo(() => generateGlowKeyframes(), []);

  return <style dangerouslySetInnerHTML={{ __html: keyframes }} />;
};

// Main highlighting component
export function CombinationHighlighter({
  existingCombinations,
  selectedFaces,
  selectedModels,
  colorPalette = DEFAULT_COLOR_PALETTE,
  defaultGlowConfig = DEFAULT_GLOW_CONFIG,
  onCombinationHighlight,
  className = "",
  debug = false,
  children,
}: CombinationHighlighterProps & { children: React.ReactNode }) {
  const {
    combinations,
    faceIdentifications,
    modelIdentifications,
    getImageGlowStyles,
    hasImageCombinations,
    getImageCombinations,
    statistics,
  } = useCombinationHighlighter(
    existingCombinations,
    selectedFaces,
    selectedModels,
    colorPalette,
    defaultGlowConfig
  );

  const { getAnimationStyle } = useGlowAnimation(
    defaultGlowConfig.enablePulse,
    defaultGlowConfig.animationDuration
  );

  // Create context value for child components
  const contextValue = useMemo(
    () => ({
      // Data
      combinations,
      faceIdentifications,
      modelIdentifications,
      statistics,

      // Style functions
      getImageGlowStyles: (imageName: string, imageType: "face" | "model") => {
        const baseStyle = getImageGlowStyles(imageName, imageType);
        if (!baseStyle) return null;

        return getAnimationStyle(
          baseStyle,
          hasImageCombinations(imageName, imageType)
        );
      },

      // Utility functions
      hasImageCombinations,
      getImageCombinations,

      // Event handler
      onHighlight: (imageName: string, imageType: "face" | "model") => {
        const imageCombinations = getImageCombinations(imageName, imageType);
        if (
          imageCombinations.length > 0 &&
          onCombinationHighlight &&
          imageCombinations[0]
        ) {
          onCombinationHighlight(imageCombinations[0]);
        }
      },

      // Config
      debug,
    }),
    [
      combinations,
      faceIdentifications,
      modelIdentifications,
      statistics,
      getImageGlowStyles,
      getAnimationStyle,
      hasImageCombinations,
      getImageCombinations,
      onCombinationHighlight,
      debug,
    ]
  );

  if (debug) {
    console.log("CombinationHighlighter Debug:", {
      existingCombinations: existingCombinations.length,
      selectedFaces: selectedFaces.length,
      selectedModels: selectedModels.length,
      processedCombinations: combinations.length,
      statistics,
    });
  }

  return (
    <CombinationHighlighterContext.Provider value={contextValue}>
      <div className={`combination-highlighter ${className}`}>
        <GlowKeyframes />
        {children}
      </div>
    </CombinationHighlighterContext.Provider>
  );
}

// Context for sharing combination data with child components
export const CombinationHighlighterContext = React.createContext<{
  combinations: any[];
  faceIdentifications: any[];
  modelIdentifications: any[];
  statistics: any;
  getImageGlowStyles: (
    imageName: string,
    imageType: "face" | "model"
  ) => React.CSSProperties | null;
  hasImageCombinations: (
    imageName: string,
    imageType: "face" | "model"
  ) => boolean;
  getImageCombinations: (
    imageName: string,
    imageType: "face" | "model"
  ) => any[];
  onHighlight: (imageName: string, imageType: "face" | "model") => void;
  debug: boolean;
} | null>(null);

// Hook to use the combination context
export function useCombinationContext() {
  const context = React.useContext(CombinationHighlighterContext);
  if (!context) {
    throw new Error(
      "useCombinationContext must be used within a CombinationHighlighter"
    );
  }
  return context;
}
