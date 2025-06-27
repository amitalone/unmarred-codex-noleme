# Usage Example for SelectedMaceModelContainer

Here's an example of how to integrate the `SelectedMaceModelContainer` into an existing page in your application:

```tsx
"use client";
import { useState, useCallback } from "react";
import { FaceImage, ModelImage } from "@repo/shared-interfaces";
import { SelectedMaceModelContainer } from "@repo/face-swap-ui/selectedMaceModelContainer";
import { ImageGrid } from "@repo/base-ui/imageGrid";

interface ExamplePageProps {
  availableFaces: FaceImage[];
  availableModels: ModelImage[];
}

export function ExamplePage({
  availableFaces,
  availableModels,
}: ExamplePageProps) {
  const [selectedFaces, setSelectedFaces] = useState<FaceImage[]>([]);
  const [selectedModels, setSelectedModels] = useState<ModelImage[]>([]);

  const handleFaceSelect = useCallback((face: FaceImage) => {
    setSelectedFaces((prev) => {
      const exists = prev.some((f) => f.name === face.name);
      if (exists) {
        return prev.filter((f) => f.name !== face.name);
      } else {
        return [...prev, face];
      }
    });
  }, []);

  const handleModelSelect = useCallback((model: ModelImage) => {
    setSelectedModels((prev) => {
      const exists = prev.some((m) => m.name === model.name);
      if (exists) {
        return prev.filter((m) => m.name !== model.name);
      } else {
        return [...prev, model];
      }
    });
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedFaces([]);
    setSelectedModels([]);
  }, []);

  return (
    <div className="example-page">
      <h1>Select Face and Model Images</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2>Face Images</h2>
          <ImageGrid
            images={availableFaces}
            onImageClick={handleFaceSelect}
            selectedImages={selectedFaces.map((f) => f.name)}
          />
        </div>

        <div>
          <h2>Model Images</h2>
          <ImageGrid
            images={availableModels}
            onImageClick={handleModelSelect}
            selectedImages={selectedModels.map((m) => m.name)}
          />
        </div>
      </div>

      {/* Add the SelectedMaceModelContainer */}
      <SelectedMaceModelContainer
        selectedFaces={selectedFaces}
        selectedModels={selectedModels}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
}
```

This example demonstrates:

1. Maintaining selected face and model images in state
2. Handling selection/deselection of images
3. Passing selected images to the SelectedMaceModelContainer
4. Implementing a clear selection handler
5. Using the component alongside other UI elements

You can customize the position, title, and appearance as needed for your specific use case.
