"use client";
import {
  Popover as FlowPopover,
  PopoverProps as FlowPopoverProps,
} from "flowbite-react";
import React from "react";

export interface PopoverProps {
  /**
   * The content of the popover
   */
  content: React.ReactNode;
  /**
   * Additional classes for the popover
   */
  className?: string;
  /**
   * Make the popover open by default
   */
  defaultOpen?: boolean;
  /**
   * Placement of the popover
   */
  placement?: "top" | "right" | "bottom" | "left";
  /**
   * Offset skidding in px
   */
  offsetSkidding?: number;
  /**
   * Offset distance in px
   */
  offsetDistance?: number;
  /**
   * Set arrow position
   */
  arrow?: boolean;
  /**
   * Trigger element
   */
  children: React.ReactNode;
  /**
   * Optional ID for the popover
   */
  id?: string;
  /**
   * Optional title for the popover
   */
  title?: React.ReactNode;
  /**
   * Optional CSS style
   */
  style?: React.CSSProperties;
  /**
   * Optional trigger behavior
   */
  trigger?: "hover" | "click";
}

export function Popover({
  content,
  className,
  defaultOpen = false,
  placement = "bottom",
  offsetSkidding = 0,
  offsetDistance = 8,
  arrow = true,
  children,
  id,
  title,
  style,
  trigger = "hover",
}: PopoverProps) {
  return (
    <FlowPopover
      defaultOpen={defaultOpen}
      placement={placement}
      trigger={trigger}
      style={style}
      className={className}
      offsetSkidding={offsetSkidding}
      offsetDistance={offsetDistance}
      arrow={arrow}
      content={content}
    >
      {children}
    </FlowPopover>
  );
}
