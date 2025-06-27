"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconClose,
  IconPlay,
} from "@repo/design-system/icons";
import {
  BaseImage,
  FaceImage,
  ModelImage,
  OutputImage,
} from "@repo/shared-interfaces";
import { IconButton } from "../iconButton";

type ImageType = FaceImage | ModelImage | OutputImage | BaseImage;

interface FullscreenImageViewerProps {
  images: ImageType[];
  startIndex: number;
  onClose: () => void;
  className?: string;
  showImageInfo?: boolean;
}

export function FullscreenImageViewer({
  images,
  startIndex,
  onClose,
  className = "",
  showImageInfo = false,
}: FullscreenImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  // Ensure the index is within bounds
  useEffect(() => {
    if (images.length === 0) {
      onClose();
      return;
    }

    // Clamp the index to valid range
    const validIndex = Math.max(0, Math.min(startIndex, images.length - 1));
    setCurrentIndex(validIndex);
  }, [images, startIndex, onClose]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, handleNext, handlePrevious]);

  // Get image type-specific information
  const getImageInfo = (image: ImageType) => {
    if ("type" in image) {
      if (image.type === "Output" && "face" in image && "model" in image) {
        const outputImage = image as OutputImage;
        return (
          <div className="fullscreen-image-viewer__info">
            <p className="fullscreen-image-viewer__info-type">
              Type: {outputImage.type}
            </p>
            <p className="fullscreen-image-viewer__info-date">
              {outputImage.createdfmt || outputImage.created || ""}
            </p>
            <div className="fullscreen-image-viewer__info-related">
              <p>Face: {outputImage.face.name}</p>
              <p>Model: {outputImage.model.name}</p>
            </div>
          </div>
        );
      } else if (image.type === "Face" || image.type === "Model") {
        return (
          <div className="fullscreen-image-viewer__info">
            <p className="fullscreen-image-viewer__info-type">
              Type: {image.type}
            </p>
            <p className="fullscreen-image-viewer__info-date">
              {image.createdfmt || image.created || ""}
            </p>
            <p className="fullscreen-image-viewer__info-name">{image.name}</p>
          </div>
        );
      }
    }
    return null;
  };

  // Close if there are no images
  if (images.length === 0) {
    return null;
  }

  // Ensure currentImage is defined
  const currentImage =
    images[currentIndex] ||
    ({
      src: "",
      alt: "",
      name: "",
      type: "Face" as const,
    } as ImageType);

  return (
    <div
      className={`fullscreen-image-viewer ${className}`}
      data-testid="fullscreen-image-viewer"
    >
      <div className="fullscreen-image-viewer__overlay" onClick={onClose}>
        <div
          className="fullscreen-image-viewer__content"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="fullscreen-image-viewer__close-button"
            data-testid="close-button-container"
          >
            <IconButton
              reactIcon={IconClose}
              textColor="text-white"
              shadowClass="shadow-md"
              onClick={onClose}
              data-testid="close-button"
              size={42}
            />
          </div>

          <div
            className="fullscreen-image-viewer__nav-button fullscreen-image-viewer__nav-button--left"
            data-testid="previous-button"
          >
            <IconButton
              reactIcon={IconChevronLeft}
              textColor="text-white"
              shadowClass="shadow-md"
              onClick={handlePrevious}
              aria-label="Previous image"
              size={42}
            />
          </div>

          <div className="fullscreen-image-viewer__image-container">
            <img
              src={currentImage.src}
              alt={currentImage.alt || `Image ${currentIndex + 1}`}
              className="fullscreen-image-viewer__image"
              data-testid="fullscreen-image"
            />
            {showImageInfo && getImageInfo(currentImage)}
          </div>

          <div
            className="fullscreen-image-viewer__nav-button fullscreen-image-viewer__nav-button--right"
            data-testid="next-button"
          >
            <IconButton
              reactIcon={IconChevronRight}
              textColor="text-white"
              shadowClass="shadow-md"
              onClick={handleNext}
              aria-label="Next image"
              size={42}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
