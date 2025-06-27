"use client";
import React from "react";
import {
  FaceImage as FaceImageType,
  ModelImage as ModelImageType,
} from "@repo/shared-interfaces";
import {
  FaceImage as BaseFaceImage,
  ModelImage as BaseModelImage,
} from "@repo/base-ui/imageButton";
import { useCombinationContext } from "./combinationHighlighter";

interface HighlightedImageProps {
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children?: React.ReactNode;
}

/**
 * Enhanced FaceImage with combination highlighting
 */
export function HighlightedFaceImage({
  src,
  alt,
  className = "",
  onClick,
  onMouseEnter,
  onMouseLeave,
  children,
  ...imageProps
}: FaceImageType & HighlightedImageProps) {
  const { getImageGlowStyles, hasImageCombinations, onHighlight, debug } =
    useCombinationContext();

  const imageName = imageProps.name;
  const hasCombinations = hasImageCombinations(imageName, "face");
  const glowStyles = getImageGlowStyles(imageName, "face");

  const handleClick = () => {
    if (hasCombinations) {
      onHighlight(imageName, "face");
    }
    onClick?.();
  };

  const handleMouseEnter = () => {
    if (debug && hasCombinations) {
      console.log(`Face ${imageName} has combinations`);
    }
    onMouseEnter?.();
  };

  const combinedStyles = glowStyles
    ? {
        ...glowStyles,
        cursor: hasCombinations ? "pointer" : "default",
      }
    : {};

  return (
    <div
      className={`highlighted-face-image ${hasCombinations ? "has-combinations" : ""} ${className}`}
      style={combinedStyles}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <BaseFaceImage src={src} alt={alt || imageName} {...imageProps} />
      {children}
      {hasCombinations && (
        <div className="combination-indicator face-indicator">✨</div>
      )}
    </div>
  );
}

/**
 * Enhanced ModelImage with combination highlighting
 */
export function HighlightedModelImage({
  src,
  alt,
  className = "",
  onClick,
  onMouseEnter,
  onMouseLeave,
  children,
  ...imageProps
}: ModelImageType & HighlightedImageProps) {
  const { getImageGlowStyles, hasImageCombinations, onHighlight, debug } =
    useCombinationContext();

  const imageName = imageProps.name;
  const hasCombinations = hasImageCombinations(imageName, "model");
  const glowStyles = getImageGlowStyles(imageName, "model");

  const handleClick = () => {
    if (hasCombinations) {
      onHighlight(imageName, "model");
    }
    onClick?.();
  };

  const handleMouseEnter = () => {
    if (debug && hasCombinations) {
      console.log(`Model ${imageName} has combinations`);
    }
    onMouseEnter?.();
  };

  const combinedStyles = glowStyles
    ? {
        ...glowStyles,
        cursor: hasCombinations ? "pointer" : "default",
      }
    : {};

  return (
    <div
      className={`highlighted-model-image ${hasCombinations ? "has-combinations" : ""} ${className}`}
      style={combinedStyles}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <BaseModelImage src={src} alt={alt || imageName} {...imageProps} />
      {children}
      {hasCombinations && (
        <div className="combination-indicator model-indicator">✨</div>
      )}
    </div>
  );
}
