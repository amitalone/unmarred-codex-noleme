import { BaseImage } from "../types";

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
