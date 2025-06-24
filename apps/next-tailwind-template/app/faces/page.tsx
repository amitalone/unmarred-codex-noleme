"use client";
import Image from "next/image";
//import { Card } from "@repo/base-ui/card";
import { Card } from "@repo/face-swap-ui/card";
import { MasonryImageGrid } from "@repo/base-ui/masonryImageGrid";
import { FixedHeightContainer } from "@repo/base-ui/fixedHeightContainer";
import { ImageGalleryPagePage } from "@repo/face-swap-ui/imageGalleryPage";
import type { BaseImage } from "@repo/base-ui/types";
const demoImages: BaseImage[] = [
  // Images for face page
  {
    src: "https://dummyimage.com/900x700/FF338C/fff&text=Fashion",
    alt: "Fashion image",
    width: 900,
    height: 700,
  },
  {
    src: "https://dummyimage.com/600x800/33FF57/000&text=Architecture",
    alt: "Architecture image",
    width: 600,
    height: 800,
  },
  {
    src: "https://dummyimage.com/800x800/3357FF/fff&text=People",
    alt: "People image",
    width: 800,
    height: 800,
  },
  {
    src: "https://dummyimage.com/900x600/FF33DA/000&text=Technology",
    alt: "Technology image",
    width: 900,
    height: 600,
  },
  {
    src: "https://dummyimage.com/600x800/33FF57/000&text=Architecture",
    alt: "Architecture image",
    width: 600,
    height: 800,
  },
];
export default function Page() {
  return (
    <>
      <ImageGalleryPagePage images={demoImages} title="Faces" />
    </>
  );
}
