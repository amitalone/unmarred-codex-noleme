"use client";
import { type ReactNode, useState } from "react";
import { SideBarLayout } from "@repo/base-ui/sideBarLayout";
import { Drawer } from "@repo/design-system/drawer";
import { SelectedMaceModelContainer } from "../selectedMaceModelContainer/selectedMaceModelContainer";
import {
  FaceSwapSidebar,
  type SideBarLink,
} from "../faceSwapSidebar/faceSwapSidebar";
import { FaceImage, ModelImage } from "@repo/shared-interfaces";

const mockFaceImages: FaceImage[] = [
  // Images for face page
  {
    src: "https://dummyimage.com/900x700/FF338C/fff&text=Fashion",
    alt: "Fashion image",
    width: 900,
    height: 700,
    type: "Face",
    name: "fashion1.jpg",
  },
  {
    src: "https://dummyimage.com/600x800/33FF57/000&text=Architecture",
    alt: "Architecture image",
    width: 600,
    height: 800,
    type: "Face",
    name: "architecture1.jpg",
  },
  {
    src: "https://dummyimage.com/800x800/3357FF/fff&text=People",
    alt: "People image",
    width: 800,
    height: 800,
    type: "Face",
    name: "people1.jpg",
  },
];
const mockModelImages: ModelImage[] = [
  // Images for model page
  {
    src: "https://dummyimage.com/900x700/FF338C/fff&text=Fashion",
    alt: "Fashion image",
    width: 900,
    height: 700,
    type: "Model",
    name: "fashion1.jpg",
  },
  {
    src: "https://dummyimage.com/600x800/33FF57/000&text=Architecture",
    alt: "Architecture image",
    width: 600,
    height: 800,
    type: "Model",
    name: "architecture1.jpg",
  },
  {
    src: "https://dummyimage.com/800x800/3357FF/fff&text=People",
    alt: "People image",
    width: 800,
    height: 800,
    type: "Model",
    name: "people1.jpg",
  },
];

export function FaceSwapAppLayout({
  children,
  className = "",
  sideBarLinks = [],
}: {
  children: ReactNode;
  className?: string;
  sideBarLinks?: SideBarLink[];
}) {
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
      <SelectedMaceModelContainer
        selectedFaces={mockFaceImages}
        selectedModels={mockModelImages}
      />
    </div>
  );
}
