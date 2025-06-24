"use client";
import { MasonryImageGrid } from "@repo/base-ui/masonryImageGrid";

// Sample images for the example
const demoImages = [
  {
    imageSrc: "https://source.unsplash.com/random/800x600?nature",
    alt: "Nature image",
  },
  {
    imageSrc: "https://source.unsplash.com/random/600x800?architecture",
    alt: "Architecture image",
  },
  {
    imageSrc: "https://source.unsplash.com/random/800x800?people",
    alt: "People image",
  },
  {
    imageSrc: "https://source.unsplash.com/random/900x600?technology",
    alt: "Technology image",
  },
  {
    imageSrc: "https://source.unsplash.com/random/600x900?animals",
    alt: "Animals image",
  },
  {
    imageSrc: "https://source.unsplash.com/random/800x500?travel",
    alt: "Travel image",
  },
  {
    imageSrc: "https://source.unsplash.com/random/700x900?food",
    alt: "Food image",
  },
  {
    imageSrc: "https://source.unsplash.com/random/800x700?sports",
    alt: "Sports image",
  },
  {
    imageSrc: "https://source.unsplash.com/random/600x600?art",
    alt: "Art image",
  },
  {
    imageSrc: "https://source.unsplash.com/random/900x700?fashion",
    alt: "Fashion image",
  },
];

export default function MasonryImageGridExample() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Masonry Image Grid Example</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Default Configuration</h2>
        <MasonryImageGrid images={demoImages} />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Custom Column Width</h2>
        <MasonryImageGrid images={demoImages} columnWidth={250} />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Fixed Column Count</h2>
        <MasonryImageGrid images={demoImages} columnCount={3} />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Custom Gaps</h2>
        <MasonryImageGrid images={demoImages} columnGap={20} rowGap={20} />
      </div>
    </div>
  );
}
