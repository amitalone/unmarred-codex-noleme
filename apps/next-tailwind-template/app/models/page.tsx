"use client";
import Image from "next/image";
//import { Card } from "@repo/base-ui/card";
import { Card } from "@repo/face-swap-ui/card";
import { MasonryImageGrid } from "@repo/base-ui/masonryImageGrid";
import { FixedHeightContainer } from "@repo/base-ui/fixedHeightContainer";
import { OutputPage } from "@repo/face-swap-ui/outputPage";
const demoImages = [
  {
    imageSrc: "https://dummyimage.com/800x600/FF5733/fff&text=Nature", // Orange background, white text
    alt: "Nature image",
    type: "OUTPUT",
  },
  {
    imageSrc: "https://dummyimage.com/600x800/33FF57/000&text=Architecture", // Green background, black text
    alt: "Architecture image",
    type: "OUTPUT",
  },
  {
    imageSrc: "https://dummyimage.com/800x800/3357FF/fff&text=People", // Blue background, white text
    alt: "People image",
    type: "OUTPUT",
  },
  {
    imageSrc: "https://dummyimage.com/900x600/FF33DA/000&text=Technology", // Pink background, black text
    alt: "Technology image",
    type: "OUTPUT",
  },
  {
    imageSrc: "https://dummyimage.com/600x900/33DAFF/000&text=Animals", // Light Blue background, black text
    alt: "Animals image",
    type: "OUTPUT",
  },
  {
    imageSrc: "https://dummyimage.com/800x500/DAFF33/000&text=Travel", // Yellow-Green background, black text
    alt: "Travel image",
    type: "OUTPUT",
  },
  {
    imageSrc: "https://dummyimage.com/700x900/FF8C33/fff&text=Food", // Dark Orange background, white text
    alt: "Food image",
    type: "OUTPUT",
  },
  {
    imageSrc: "https://dummyimage.com/800x700/8C33FF/fff&text=Sports", // Purple background, white text
    alt: "Sports image",
    type: "OUTPUT",
  },
  {
    imageSrc: "https://dummyimage.com/600x600/33FF8C/000&text=Art", // Teal background, black text
    alt: "Art image",
    type: "OUTPUT",
  },
  {
    imageSrc: "https://dummyimage.com/900x700/FF338C/fff&text=Fashion", // Red-Pink background, white text
    alt: "Fashion image",
    type: "OUTPUT",
  },
  {
    imageSrc: "https://dummyimage.com/600x800/33FF57/000&text=Architecture", // Green background, black text
    alt: "Architecture image",
    type: "OUTPUT",
  },
  {
    imageSrc: "https://dummyimage.com/800x800/3357FF/fff&text=People", // Blue background, white text
    alt: "People image",
    type: "OUTPUT",
  },
  {
    imageSrc: "https://dummyimage.com/900x600/FF33DA/000&text=Technology", // Pink background, black text
    alt: "Technology image",
    type: "OUTPUT",
  },
  {
    imageSrc: "https://dummyimage.com/600x800/33FF57/000&text=Architecture", // Green background, black text
    alt: "Architecture image",
    type: "OUTPUT",
  },
  {
    imageSrc: "https://dummyimage.com/800x800/3357FF/fff&text=People", // Blue background, white text
    alt: "People image",
    type: "OUTPUT",
  },
  {
    imageSrc: "https://dummyimage.com/900x600/FF33DA/000&text=Technology", // Pink background, black text
    alt: "Technology image",
    type: "OUTPUT",
  },
];
export default function Page() {
  return (
    <>
      <OutputPage images={demoImages} title="Models" />
    </>
  );
}
