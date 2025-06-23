"use client";
import { type ReactNode, useState } from "react";
import { SideBarLayout } from "@repo/base-ui/sideBarLayout";
import {
  IconImages,
  IconBodySwapping,
  IconFaceRetouchingNatural,
} from "@repo/design-system/icons";
import { Sidebar, SidebarItem } from "@repo/design-system/sidebar";

export function FaceSwapSidebar({ className = "" }: { className?: string }) {
  return (
    <Sidebar
      className={`face-swap-sidebar ${className}`}
      aria="Face Swap Navigation"
    >
      <SidebarItem href="#" icon={IconImages}>
        {" "}
      </SidebarItem>
      <SidebarItem href="#" icon={IconFaceRetouchingNatural}>
        {" "}
      </SidebarItem>
      <SidebarItem href="#" icon={IconBodySwapping}>
        {" "}
      </SidebarItem>
    </Sidebar>
  );
}
