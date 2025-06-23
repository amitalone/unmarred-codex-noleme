"use client";
import {
  DrawerHeader,
  DrawerItems,
  Drawer as FlowDrawer,
} from "flowbite-react";
import { ReactNode } from "react";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  placement?: "left" | "right" | "top" | "bottom";
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Drawer({
  open,
  onClose,
  placement = "right",
  title,
  children,
  className,
}: DrawerProps) {
  return (
    <FlowDrawer open={open} onClose={onClose}>
      {title && <DrawerHeader title={title} />}
      <DrawerItems>{children}</DrawerItems>
    </FlowDrawer>
  );
}
