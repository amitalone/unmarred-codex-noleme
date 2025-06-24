"use client";
import React from "react";
import { ImageWithActionBar } from "@repo/base-ui";

export default function TestPage() {
  // Sample image data
  const image = {
    id: "1",
    url: "https://images.unsplash.com/photo-1500964757637-c85e8a162699",
    alt: "Beautiful landscape",
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Image Action Bar Test</h1>

      <div className="mb-8">
        <h2 className="text-xl mb-2">
          Example: Hover over the image to see the action bar
        </h2>
        <div className="w-full h-64 overflow-hidden">
          <ImageWithActionBar image={image} />
        </div>
      </div>
    </div>
  );
}
