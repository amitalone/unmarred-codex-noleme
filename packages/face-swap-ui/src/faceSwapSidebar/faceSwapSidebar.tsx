"use client";
import { type ReactNode, useState } from "react";
import { SideBarLayout } from "@repo/base-ui/sideBarLayout";
import {
  IconImages,
  IconBodySwapping,
  IconFaceRetouchingNatural,
} from "@repo/design-system/icons";
import { Sidebar, SidebarItem } from "@repo/design-system/sidebar";

export type SideBarLink = {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  linkComponent?: React.ReactNode;
};

export function FaceSwapSidebar({
  className = "",
  sideBarLinks = [],
}: {
  className?: string;
  sideBarLinks?: SideBarLink[];
}) {
  return (
    <Sidebar
      className={`face-swap-sidebar ${className}`}
      aria="Face Swap Navigation"
    >
      {sideBarLinks.map((link, index) => (
        <SidebarItem
          key={index}
          icon={link.icon}
          href={link.linkComponent ? undefined : link.href}
        >
          {link.linkComponent || link.label}
        </SidebarItem>
      ))}
    </Sidebar>
  );
}
