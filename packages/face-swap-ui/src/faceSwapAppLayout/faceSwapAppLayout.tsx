"use client";
import { type ReactNode, useState } from "react";
import { SideBarLayout } from "@repo/base-ui/sideBarLayout";
import {
  IconImages,
  IconBodySwapping,
  IconFaceRetouchingNatural,
} from "@repo/design-system/icons";
import { FaceSwapSidebar, type SideBarLink } from "./faceSwapSidebar";

export function FaceSwapAppLayout({
  children,
  className = "",
  sideBarLinks = [],
}: {
  children: ReactNode;
  className?: string;
  sideBarLinks?: SideBarLink[];
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div
      className={`face-swap-app-layout ${className}`}
      data-testid="face-swap-app-layout"
    >
      <SideBarLayout
        drawerItem={<FaceSwapSidebar sideBarLinks={sideBarLinks} />}
        leftSidebar=""
      >
        <div className="face-swap-app-layout__content">{children}</div>
      </SideBarLayout>
    </div>
  );
}
