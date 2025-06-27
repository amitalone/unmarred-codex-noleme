"use client";
import { ImageGridWithFullScreen } from "@repo/base-ui/imageGridWithFullScreen";

// Sample images for the example
const demoImages = [
  {
    src: "https://source.unsplash.com/random/800x600?nature",
    alt: "Nature image",
    name: "nature.jpg",
  },
  {
    src: "https://source.unsplash.com/random/600x800?architecture",
    alt: "Architecture image",
    name: "architecture.jpg",
  },
  {
    src: "https://source.unsplash.com/random/800x800?people",
    alt: "People image",
    name: "people.jpg",
  },
  {
    src: "https://source.unsplash.com/random/900x600?technology",
    alt: "Technology image",
    name: "technology.jpg",
  },
  {
    src: "https://source.unsplash.com/random/600x900?animals",
    alt: "Animals image",
    name: "animals.jpg",
  },
  {
    src: "https://source.unsplash.com/random/800x500?travel",
    alt: "Travel image",
    name: "travel.jpg",
  },
  {
    src: "https://source.unsplash.com/random/700x900?food",
    alt: "Food image",
    name: "food.jpg",
  },
  {
    src: "https://source.unsplash.com/random/800x700?sports",
    alt: "Sports image",
    name: "sports.jpg",
  },
  {
    src: "https://source.unsplash.com/random/600x600?art",
    alt: "Art image",
    name: "art.jpg",
  },
  {
    src: "https://source.unsplash.com/random/900x700?fashion",
    alt: "Fashion image",
    name: "fashion.jpg",
  },
];

export default function ImageGridWithFullScreenExample() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Image Grid With Fullscreen Example
      </h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Default Configuration</h2>
        <ImageGridWithFullScreen images={demoImages} />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">With Image Info</h2>
        <ImageGridWithFullScreen
          images={demoImages}
          showImageInfo={true}
          columnCount={3}
        />
      </div>
    </div>
  );
}
