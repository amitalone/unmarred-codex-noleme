"use client";
import { type ReactNode, useState } from "react";
import { SideBarLayout } from "@repo/base-ui/sideBarLayout";
import {
  IconImages,
  IconBodySwapping,
  IconFaceRetouchingNatural,
} from "@repo/design-system/icons";
import { FaceSwapSidebar } from "./faceSwapSidebar";

export function FaceSwapAppLayout({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div
      className={`face-swap-app-layout ${className}`}
      data-testid="face-swap-app-layout"
    >
      <SideBarLayout drawerItem={<FaceSwapSidebar />} leftSidebar="">
        <div className="face-swap-app-layout__content">{children}</div>
      </SideBarLayout>
    </div>
  );
}
