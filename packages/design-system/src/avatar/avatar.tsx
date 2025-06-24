"use client";
import {
  Avatar as FlowAvatar,
  AvatarProps as FlowAvatarProps,
} from "flowbite-react";
import React from "react";

export interface AvatarProps {
  alt?: string;
  img?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  rounded?: boolean;
  bordered?: boolean;
  color?:
    | "default"
    | "success"
    | "gray"
    | "info"
    | "failure"
    | "warning"
    | "pink"
    | "purple";
  statusPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  status?: "away" | "busy" | "offline" | "online";
  children?: React.ReactNode;
  className?: string;
}

export function Avatar({
  alt = "User avatar",
  img,
  size = "md",
  rounded = true,
  bordered = false,
  color = "default",
  statusPosition,
  status,
  children,
  className,
}: AvatarProps) {
  return (
    <FlowAvatar
      alt={alt}
      img={img}
      size={size}
      rounded={rounded}
      bordered={bordered}
      color={color}
      statusPosition={statusPosition}
      status={status}
      className={className}
    >
      {children}
    </FlowAvatar>
  );
}
