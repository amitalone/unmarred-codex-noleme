import React from "react";
import { MasonryImageGrid } from "@repo/base-ui/masonryImageGrid";
import { BaseImage } from "@repo/shared-interfaces";

export interface ImageDisplaySectionProps {
  images: BaseImage[];
}

export function ImageDisplaySection({ images }: ImageDisplaySectionProps) {
  return (
    <div className="image-display-section">
      <div className="image-display-section__header">
        <h3 className="image-display-section__title">
          Current Images ({images.length})
        </h3>
      </div>

      <div className="image-display-section__grid">
        <MasonryImageGrid
          images={images}
          columnWidth={200}
          columnGap={10}
          rowGap={10}
          className="image-display-section__masonry-grid"
        />
      </div>
    </div>
  );
}
