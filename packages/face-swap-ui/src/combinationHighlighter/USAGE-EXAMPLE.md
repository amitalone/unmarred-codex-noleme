# CombinationHighlighter Usage Examples

## Basic Integration

### 1. Simple Usage

```tsx
import React, { useState, useEffect } from "react";
import {
  CombinationHighlighter,
  HighlightedFaceImage,
  HighlightedModelImage,
  CombinationStats,
} from "@repo/face-swap-ui/combinationHighlighter";

function BasicExample() {
  const [existingCombinations, setExistingCombinations] = useState([]);
  const [selectedFaces, setSelectedFaces] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);

  // Fetch existing combinations from API
  useEffect(() => {
    fetch("/api/existing-combinations")
      .then((res) => res.json())
      .then(setExistingCombinations);
  }, []);

  return (
    <CombinationHighlighter
      existingCombinations={existingCombinations}
      selectedFaces={selectedFaces}
      selectedModels={selectedModels}
      onCombinationHighlight={(combination) => {
        console.log("Highlighted combination:", combination);
        // Maybe show a tooltip or modal with combination details
      }}
    >
      <CombinationStats />

      <div className="images-container">
        <section className="faces-section">
          <h3>Selected Faces</h3>
          <div className="image-grid">
            {selectedFaces.map((face) => (
              <HighlightedFaceImage key={face.name} {...face} />
            ))}
          </div>
        </section>

        <section className="models-section">
          <h3>Selected Models</h3>
          <div className="image-grid">
            {selectedModels.map((model) => (
              <HighlightedModelImage key={model.name} {...model} />
            ))}
          </div>
        </section>
      </div>
    </CombinationHighlighter>
  );
}
```

### 2. Integration with SelectedMaceModelContainer

```tsx
// Update your existing SelectedMaceModelContainer
import {
  CombinationHighlighter,
  HighlightedFaceImage,
  HighlightedModelImage,
  CombinationLegend,
  CombinationStats,
} from "./combinationHighlighter";

interface SelectedMaceModelContainerProps {
  className?: string;
  position?: "left" | "right";
  title?: string;
  existingCombinations?: OutputImage[]; // Add this prop
}

export function SelectedMaceModelContainer({
  className = "",
  position = "right",
  title = "Selected Images",
  existingCombinations = [], // Add this prop
}: SelectedMaceModelContainerProps) {
  // ...existing state and logic...

  return (
    <CombinationHighlighter
      existingCombinations={existingCombinations}
      selectedFaces={selectedFaces}
      selectedModels={selectedModels}
      onCombinationHighlight={(combination) => {
        // Show combination details or navigate to result
        console.log("Combination exists:", combination);
      }}
    >
      <IconButton
        onClick={toggleDrawer}
        className={`selected-mace-model-container__toggle-button ${className}`}
        data-testid="selected-mace-model-container-toggle-button"
      >
        <IconImages size={24} />
        {totalSelected > 0 && (
          <span className="selected-mace-model-container__badge">
            {totalSelected}
          </span>
        )}
      </IconButton>

      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        position={position}
        title={title}
        className={`selected-mace-model-container__drawer ${className}`}
      >
        <div className="selected-mace-model-container__content">
          {/* Add combination information */}
          {existingCombinations.length > 0 && (
            <>
              <CombinationStats />
              <CombinationLegend maxItems={5} />
            </>
          )}

          {/* ...existing upload error code... */}

          <div className="selected-mace-model-container__columns-layout">
            {selectedFaces.length > 0 && (
              <div className="selected-mace-model-container__column">
                <h6 className="selected-mace-model-container__section-title">
                  Face Images ({selectedFaces.length})
                </h6>
                <div className="selected-mace-model-container__image-grid">
                  {selectedFaces.map((face) => (
                    <div
                      key={face.name}
                      className="selected-mace-model-container__image-item"
                    >
                      <div className="selected-mace-model-container__image-wrapper">
                        {/* Replace FaceImage with HighlightedFaceImage */}
                        <HighlightedFaceImage
                          src={face.src}
                          alt={face.alt || face.name}
                          name={face.name}
                          type="Face"
                        />
                        <button
                          className="selected-mace-model-container__remove-button"
                          onClick={() => removeFace(face.name)}
                        >
                          <IconClose size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedModels.length > 0 && (
              <div className="selected-mace-model-container__column">
                <h3 className="selected-mace-model-container__section-title">
                  Model Images ({selectedModels.length})
                </h3>
                <div className="selected-mace-model-container__image-grid">
                  {selectedModels.map((model) => (
                    <div
                      key={model.name}
                      className="selected-mace-model-container__image-item"
                    >
                      <div className="selected-mace-model-container__image-wrapper">
                        {/* Replace ModelImage with HighlightedModelImage */}
                        <HighlightedModelImage
                          src={model.src}
                          alt={model.alt || model.name}
                          name={model.name}
                          type="Model"
                        />
                        <button
                          className="selected-mace-model-container__remove-button"
                          onClick={() => removeModel(model.name)}
                        >
                          <IconClose size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ...rest of existing code... */}
        </div>
      </Drawer>
    </CombinationHighlighter>
  );
}
```

### 3. Custom Styling and Configuration

```tsx
import {
  CombinationHighlighter,
  HighlightedFaceImage,
  HighlightedModelImage,
} from "@repo/face-swap-ui/combinationHighlighter";

const customColors = {
  primary: [
    "#FF6B6B", // Coral Red
    "#4ECDC4", // Turquoise
    "#45B7D1", // Sky Blue
    "#96CEB4", // Mint Green
    "#FECA57", // Sunny Yellow
    "#FF9FF3", // Pink
    "#54A0FF", // Blue
    "#5F27CD", // Purple
  ],
  secondary: [
    "#FF5252",
    "#26D0CE",
    "#2196F3",
    "#66BB6A",
    "#FFC107",
    "#E91E63",
    "#3F51B5",
    "#9C27B0",
  ],
  accent: [
    "#FFCDD2",
    "#B2EBF2",
    "#BBDEFB",
    "#C8E6C9",
    "#FFF3E0",
    "#FCE4EC",
    "#E8EAF6",
    "#F3E5F5",
  ],
};

const glowConfig = {
  intensity: 0.9,
  animationDuration: 2500,
  enablePulse: true,
};

function CustomStyledExample() {
  return (
    <CombinationHighlighter
      existingCombinations={combinations}
      selectedFaces={faces}
      selectedModels={models}
      colorPalette={customColors}
      defaultGlowConfig={glowConfig}
      className="my-custom-highlighter"
      onCombinationHighlight={(combination) => {
        // Show custom modal or notification
        showCombinationModal(combination);
      }}
    >
      {/* Your content */}
    </CombinationHighlighter>
  );
}
```

### 4. Using with Custom Image Components

```tsx
import { useCombinationContext } from "@repo/face-swap-ui/combinationHighlighter";

function CustomImageCard({ image, type }) {
  const { getImageGlowStyles, hasImageCombinations, onHighlight } =
    useCombinationContext();

  const hasCombinations = hasImageCombinations(image.name, type);
  const glowStyles = getImageGlowStyles(image.name, type);

  return (
    <div
      className={`custom-image-card ${hasCombinations ? "has-glow" : ""}`}
      style={glowStyles || {}}
      onClick={() => hasCombinations && onHighlight(image.name, type)}
    >
      <img src={image.src} alt={image.alt} />
      <div className="image-info">
        <h4>{image.name}</h4>
        {hasCombinations && (
          <span className="combination-badge">✨ Has combinations</span>
        )}
      </div>
    </div>
  );
}

function CustomExample() {
  return (
    <CombinationHighlighter {...props}>
      {faces.map((face) => (
        <CustomImageCard key={face.name} image={face} type="face" />
      ))}
      {models.map((model) => (
        <CustomImageCard key={model.name} image={model} type="model" />
      ))}
    </CombinationHighlighter>
  );
}
```

### 5. API Integration Example

```tsx
import { useState, useEffect } from "react";

function ApiIntegrationExample() {
  const [combinations, setCombinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch combinations when selected images change
  useEffect(() => {
    if (selectedFaces.length === 0 && selectedModels.length === 0) {
      setCombinations([]);
      return;
    }

    const fetchCombinations = async () => {
      setLoading(true);
      try {
        const faceNames = selectedFaces.map((f) => f.name);
        const modelNames = selectedModels.map((m) => m.name);

        const response = await fetch("/api/check-combinations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ faces: faceNames, models: modelNames }),
        });

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        setCombinations(data);
      } catch (err) {
        setError(err.message);
        setCombinations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCombinations();
  }, [selectedFaces, selectedModels]);

  if (loading) return <div>Loading combinations...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <CombinationHighlighter
      existingCombinations={combinations}
      selectedFaces={selectedFaces}
      selectedModels={selectedModels}
      onCombinationHighlight={(combination) => {
        // Navigate to existing result
        window.open(combination.output.src, "_blank");
      }}
    >
      {/* Your UI */}
    </CombinationHighlighter>
  );
}
```

### 6. Debug Mode Example

```tsx
function DebugExample() {
  return (
    <CombinationHighlighter
      existingCombinations={combinations}
      selectedFaces={faces}
      selectedModels={models}
      debug={process.env.NODE_ENV === "development"}
      onCombinationHighlight={(combo) => {
        console.log("Combination highlighted:", {
          id: combo.id,
          face: combo.face.name,
          model: combo.model.name,
          color: combo.glowConfig.color,
          created: combo.createdFmt,
        });
      }}
    >
      <CombinationDebugPanel />
      {/* Other components */}
    </CombinationHighlighter>
  );
}
```

## Usage Tips

1. **Performance**: The component automatically memoizes expensive calculations
2. **Accessibility**: All highlighted images support keyboard navigation
3. **Responsive**: Works well on mobile devices with touch interactions
4. **Customization**: Easy to theme with CSS custom properties
5. **TypeScript**: Full type safety with comprehensive interfaces

## Common Patterns

### Showing Combination Details

```tsx
const handleCombinationHighlight = (combination) => {
  setSelectedCombination(combination);
  setShowModal(true);
};
```

### Custom Color Schemes

```tsx
const darkModeColors = {
  primary: ["#ef4444", "#f97316", "#eab308", "#22c55e"],
  // ... etc
};
```

### Conditional Rendering

```tsx
{
  existingCombinations.length > 0 && (
    <CombinationHighlighter {...props}>
      {/* Only show when there are combinations */}
    </CombinationHighlighter>
  );
}
```
