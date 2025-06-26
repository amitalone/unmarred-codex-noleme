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
};

export function ImageButton({
  src,
  alt,
  onClick,
  "data-testid": testId,
  rounded = true,
  payload,
  className,
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
      <Avatar img={src} alt={alt} size="md" rounded={rounded} />
    </div>
  );
}
