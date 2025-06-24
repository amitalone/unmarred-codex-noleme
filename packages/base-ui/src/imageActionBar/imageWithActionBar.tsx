"use client";
import React from "react";
import { ImageActionBar } from "./imageActionBar";
import { BaseImage } from "../types";

type ImageWithActionBarProps = {
  image: BaseImage;
  className?: string;
  alt?: string;
};

/**
 * A component that displays an image with an action bar that appears on hover
 */
export function ImageWithActionBar({
  image,
  className = "",
  alt = "",
}: ImageWithActionBarProps) {
  return (
    <div className="has-image-action-bar relative">
      <img
        src={image.url}
        alt={alt || image.alt || ""}
        className={`w-full h-auto object-cover ${className}`}
        style={{ display: "block" }} /* Ensures no extra space below image */
      />
      <ImageActionBar
        image={image}
        position="bottom"
        alignment="center"
        isVisible={false}
      />
    </div>
  );
}
