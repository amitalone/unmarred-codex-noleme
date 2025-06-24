import { Button } from "@repo/design-system/button";

import { BaseImage } from "../types";
import { IconButton } from "../iconButton/iconButton";
import {
  IconDelete,
  IconBodySwapping,
  IconMenu,
} from "@repo/design-system/icons";
import { Children } from "react";

type ImageActionBarProps = {
  image: BaseImage;
  children?: React.ReactNode;
  className?: string;
};

export function ImageActionBar({
  image,
  children,
  className = "",
}: ImageActionBarProps) {
  return (
    <div
      className={`image-action-bar ${className}`}
      data-testid="image-action-bar"
      role="toolbar"
      aria-label="Image actions"
    >
      {children}
    </div>
  );
}
