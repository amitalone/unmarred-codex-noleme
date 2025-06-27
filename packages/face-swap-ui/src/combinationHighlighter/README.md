# CombinationHighlighter

A React component system for highlighting face-model combinations with beautiful glow effects and animations.

## Features

- 🌟 **Glow/Highlight Effects**: Beautiful pulsing glow animations for images with existing combinations
- 🎨 **Smart Color Management**: Auto-generates unique colors for each combination
- 🔍 **Combination Detection**: Automatically identifies which faces and models have existing combinations
- 📊 **Statistics & Analytics**: Built-in statistics and debug components
- ♿ **Accessibility**: Full ARIA support and keyboard navigation
- 🎭 **Customizable**: Extensive theming and configuration options
- 🚀 **Performance**: Optimized with React hooks and memoization

## Quick Start

### Basic Usage

```tsx
import {
  CombinationHighlighter,
  HighlightedFaceImage,
  HighlightedModelImage,
  CombinationStats,
  CombinationLegend,
} from "@repo/face-swap-ui/combinationHighlighter";

function MyComponent() {
  const [existingCombinations, setExistingCombinations] = useState([]);
  const [selectedFaces, setSelectedFaces] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);

  return (
    <CombinationHighlighter
      existingCombinations={existingCombinations}
      selectedFaces={selectedFaces}
      selectedModels={selectedModels}
      onCombinationHighlight={(combination) => {
        console.log("Combination highlighted:", combination);
      }}
    >
      <CombinationStats />
      <CombinationLegend />

      <div className="faces-grid">
        {selectedFaces.map((face) => (
          <HighlightedFaceImage
            key={face.name}
            {...face}
            onClick={() => console.log("Face clicked:", face.name)}
          />
        ))}
      </div>

      <div className="models-grid">
        {selectedModels.map((model) => (
          <HighlightedModelImage
            key={model.name}
            {...model}
            onClick={() => console.log("Model clicked:", model.name)}
          />
        ))}
      </div>
    </CombinationHighlighter>
  );
}
```

### Advanced Configuration

```tsx
const customColorPalette = {
  primary: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"],
  secondary: ["#ff5252", "#26d0ce", "#2196f3", "#66bb6a", "#ffc107"],
  accent: ["#ffcdd2", "#b2ebf2", "#bbdefb", "#c8e6c9", "#fff3e0"],
};

const customGlowConfig = {
  intensity: 0.8,
  animationDuration: 3000,
  enablePulse: true,
};

<CombinationHighlighter
  existingCombinations={combinations}
  selectedFaces={faces}
  selectedModels={models}
  colorPalette={customColorPalette}
  defaultGlowConfig={customGlowConfig}
  debug={process.env.NODE_ENV === "development"}
  onCombinationHighlight={(combination) => {
    // Handle combination highlight
    showCombinationModal(combination);
  }}
>
  {/* Your components */}
</CombinationHighlighter>;
```

## API Reference

### CombinationHighlighter Props

| Prop                     | Type                                      | Description                               | Default                 |
| ------------------------ | ----------------------------------------- | ----------------------------------------- | ----------------------- |
| `existingCombinations`   | `OutputImage[]`                           | Array of existing face-model combinations | `[]`                    |
| `selectedFaces`          | `FaceImage[]`                             | Currently selected face images            | `[]`                    |
| `selectedModels`         | `ModelImage[]`                            | Currently selected model images           | `[]`                    |
| `colorPalette`           | `ColorPalette`                            | Custom color palette for combinations     | `DEFAULT_COLOR_PALETTE` |
| `defaultGlowConfig`      | `Partial<GlowConfiguration>`              | Glow effect configuration                 | `DEFAULT_GLOW_CONFIG`   |
| `onCombinationHighlight` | `(combination: CombinationMatch) => void` | Callback when combination is highlighted  | `undefined`             |
| `className`              | `string`                                  | Additional CSS classes                    | `""`                    |
| `debug`                  | `boolean`                                 | Enable debug mode                         | `false`                 |

### GlowConfiguration

```typescript
interface GlowConfiguration {
  color: string; // Base glow color
  intensity: number; // Glow intensity (0-1)
  animationDuration: number; // Animation duration in ms
  enablePulse: boolean; // Enable pulsing animation
}
```

### ColorPalette

```typescript
interface ColorPalette {
  primary: string[]; // Primary colors for combinations
  secondary: string[]; // Secondary colors for variations
  accent: string[]; // Accent colors for backgrounds
}
```

## Components

### HighlightedFaceImage / HighlightedModelImage

Enhanced image components that automatically apply glow effects when combinations exist.

```tsx
<HighlightedFaceImage
  src="/path/to/face.jpg"
  alt="Face description"
  name="face_123.jpg"
  type="Face"
  onClick={() => console.log("Face clicked")}
/>
```

### CombinationStats

Displays statistics about combinations.

```tsx
<CombinationStats className="my-stats" />
```

### CombinationLegend

Shows a legend of existing combinations with their colors.

```tsx
<CombinationLegend maxItems={5} />
```

### CombinationDebugPanel

Development debug panel (only shows when `debug=true`).

```tsx
<CombinationDebugPanel />
```

## Hooks

### useCombinationHighlighter

Main hook for combination logic.

```tsx
const { combinations, getImageGlowStyles, hasImageCombinations, statistics } =
  useCombinationHighlighter(
    existingCombinations,
    selectedFaces,
    selectedModels
  );
```

### useCombinationContext

Access combination context within a CombinationHighlighter.

```tsx
const { getImageGlowStyles, hasImageCombinations, onHighlight } =
  useCombinationContext();
```

### useGlowAnimation

Manage glow animation state.

```tsx
const { getAnimationStyle } = useGlowAnimation(true, 2000);
```

## Styling

The component includes comprehensive CSS with support for:

- 🌙 **Dark mode** via `prefers-color-scheme`
- 📱 **Responsive design** for mobile devices
- ♿ **Accessibility** with high contrast mode
- 🎭 **Reduced motion** support for animations

### CSS Classes

- `.combination-highlighter` - Main container
- `.highlighted-face-image` - Face image wrapper
- `.highlighted-model-image` - Model image wrapper
- `.has-combinations` - Applied to images with combinations
- `.combination-indicator` - Sparkle indicator overlay
- `.combination-stats` - Statistics component
- `.combination-legend` - Legend component

## Examples

### Integration with existing container

```tsx
// In your SelectedMaceModelContainer
import {
  CombinationHighlighter,
  HighlightedFaceImage,
  HighlightedModelImage,
} from "./combinationHighlighter";

export function SelectedMaceModelContainer({ existingCombinations }) {
  return (
    <CombinationHighlighter
      existingCombinations={existingCombinations}
      selectedFaces={selectedFaces}
      selectedModels={selectedModels}
    >
      <Drawer>
        {/* Replace FaceImage with HighlightedFaceImage */}
        {selectedFaces.map((face) => (
          <HighlightedFaceImage key={face.name} {...face} />
        ))}

        {/* Replace ModelImage with HighlightedModelImage */}
        {selectedModels.map((model) => (
          <HighlightedModelImage key={model.name} {...model} />
        ))}
      </Drawer>
    </CombinationHighlighter>
  );
}
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions for all components, hooks, and utilities.

## Performance

- Uses React.memo and useMemo for optimal re-rendering
- Efficient color calculation with caching
- Minimal DOM manipulation
- CSS-based animations for smooth performance
