"use client";
import React, { useState } from "react";
import { MasonryImageGrid } from "../masonryImageGrid";
import { FullscreenImageViewer } from "../fullScreenImageViewer";
import { MasonryImageGridProps } from "../types";
import { BaseImage } from "@repo/shared-interfaces";

export interface ImageGridWithFullScreenProps
  extends Omit<MasonryImageGridProps, "onImageClick"> {
  /**
   * Flag to indicate whether to show image information in the fullscreen viewer
   * @default false
   */
  showImageInfo?: boolean;
}

/**
 * ImageGridWithFullScreen combines a MasonryImageGrid with a FullscreenImageViewer
 * that opens when an image is clicked.
 */
export function ImageGridWithFullScreen({
  images,
  showImageInfo = false,
  ...masonryProps
}: ImageGridWithFullScreenProps) {
  const [showViewer, setShowViewer] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setShowViewer(true);
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
  };

  return (
    <>
      <MasonryImageGrid
        images={images}
        onImageClick={handleImageClick}
        {...masonryProps}
      />
      {showViewer && (
        <FullscreenImageViewer
          images={images}
          startIndex={selectedIndex}
          onClose={handleCloseViewer}
          showImageInfo={showImageInfo}
        />
      )}
    </>
  );
}
