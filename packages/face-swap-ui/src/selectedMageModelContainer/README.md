# SelectedMaceModelContainer

A component for displaying and managing selected face and model images in a sidebar drawer.

## Features

- Toggle button positioned at the bottom left of the screen
- Badge indicator showing number of selected items
- Separate sections for face and model images
- Option to clear selection
- Responsive design with grid layout
- Empty state messaging

## Usage

```tsx
import { SelectedMaceModelContainer } from "@repo/face-swap-ui/selectedMaceModelContainer";
import { FaceImage, ModelImage } from "@repo/shared-interfaces";

// Your selected image collections
const selectedFaces: FaceImage[] = [...];
const selectedModels: ModelImage[] = [...];

// Handler for clearing selection
const handleClearSelection = () => {
  // Clear your selection logic here
};

export function YourComponent() {
  return (
    <div>
      {/* Your other content */}

      <SelectedMaceModelContainer
        selectedFaces={selectedFaces}
        selectedModels={selectedModels}
        onClearSelection={handleClearSelection}
        position="right" // Optional: "left" or "right"
        title="My Selected Images" // Optional: custom title
      />
    </div>
  );
}
```

## Props

| Prop               | Type                | Default             | Description                           |
| ------------------ | ------------------- | ------------------- | ------------------------------------- |
| `className`        | `string`            | `""`                | Additional CSS class names            |
| `selectedFaces`    | `FaceImage[]`       | `[]`                | Array of selected face images         |
| `selectedModels`   | `ModelImage[]`      | `[]`                | Array of selected model images        |
| `position`         | `"left" \| "right"` | `"right"`           | Position of the drawer                |
| `title`            | `string`            | `"Selected Images"` | Title displayed in the drawer header  |
| `onClearSelection` | `() => void`        | `undefined`         | Callback when clear button is clicked |
