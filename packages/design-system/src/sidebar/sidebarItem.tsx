"use client";
import { SidebarItem as FlowSidebarItem } from "flowbite-react";
import { ReactNode } from "react";

export interface SidebarItemProps {
  children: ReactNode;
  href?: string;
  icon?: React.ElementType;
  active?: boolean;
  label?: string;
  labelColor?: string;
  className?: string;
  onClick?: () => void;
}

export function SidebarItem({
  children,
  href,
  icon,
  active,
  label,
  labelColor,
  className = "",
  onClick,
}: SidebarItemProps) {
  return (
    <FlowSidebarItem
      href={href}
      icon={icon}
      active={active}
      label={label}
      labelColor={labelColor}
      className={className}
      onClick={onClick}
    >
      {children}
    </FlowSidebarItem>
  );
}
