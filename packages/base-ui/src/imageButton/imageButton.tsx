import React, { useEffect } from "react";
import { Avatar } from "@repo/design-system/avatar";

type ImageButtonProps = {
  src: string;
  alt: string;
  onClick?: (e: React.MouseEvent<Element>, props?: ImageButtonProps) => void;
  "data-testid"?: string;
  rounded?: boolean;
  payload?: any;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function ImageButton({
  src,
  alt,
  onClick,
  "data-testid": testId,
  rounded = true,
  payload,
  className,
  size = "md",
  ...rest
}: ImageButtonProps) {
  useEffect(() => {
    console.log("Payload changed:", payload);
  }, [payload]);

  return (
    <div
      className={`${className} cursor-pointer hover:opacity-80 transition-opacity duration-200 ease-in-out`}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onClick) {
          onClick(e, {
            src,
            alt,
            "data-testid": testId,
            rounded,
            payload,
            ...rest,
          });
        }
      }}
      data-testid={testId}
    >
      <Avatar img={src} alt={alt} size={size} rounded={rounded} />
    </div>
  );
}

export function FaceImage(props: Omit<ImageButtonProps, "rounded">) {
  return (
    <ImageButton
      {...props}
      rounded={true}
      size="lg"
      data-testid={props["data-testid"] || "face-image"}
    />
  );
}

export function ModelImage(props: Omit<ImageButtonProps, "rounded">) {
  return (
    <ImageButton
      {...props}
      rounded={false}
      size="lg"
      data-testid={props["data-testid"] || "model-image"}
    />
  );
}
