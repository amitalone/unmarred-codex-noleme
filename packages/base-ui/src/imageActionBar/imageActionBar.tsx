"use client";
import { type ReactNode } from "react";
import { BaseImage } from "../types";

type ImageActionBarProps = {
  image: BaseImage;
  actions?: ReactNode;
  className?: string;
  position?: "top" | "bottom";
  alignment?: "start" | "center" | "end";
};

export function ImageActionBar({
  image,
  actions,
  className = "",
  position = "bottom",
  alignment = "center",
}: ImageActionBarProps) {
  const positionClasses = {
    top: "image-action-bar--top",
    bottom: "image-action-bar--bottom",
  };

  const alignmentClasses = {
    start: "image-action-bar--align-start",
    center: "image-action-bar--align-center",
    end: "image-action-bar--align-end",
  };

  return (
    <div
      className={`image-action-bar ${positionClasses[position]} ${alignmentClasses[alignment]} ${className}`}
      data-testid="image-action-bar"
    >
      <div
        className="image-action-bar__image-container"
        data-testid="image-action-bar-image-container"
      >
        <img
          src={image.imageSrc}
          alt={image.alt || "Image"}
          width={image.width}
          height={image.height}
          className="image-action-bar__image"
        />
      </div>

      {actions && (
        <div
          className="image-action-bar__actions"
          data-testid="image-action-bar-actions"
        >
          {actions}
        </div>
      )}
    </div>
  );
}
