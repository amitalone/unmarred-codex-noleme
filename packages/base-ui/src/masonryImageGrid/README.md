# MasonryImageGrid Component

The MasonryImageGrid component is a responsive image grid that arranges images in a masonry layout, similar to Pinterest or other image-focused applications.

## Features

- Responsive layout that adjusts to container width
- Configurable column width and spacing
- Supports dynamic image heights
- Smooth animations when images load
- Automatically positions images in the shortest column
- Works with both client-side and server-side rendering

## Usage

```tsx
import { MasonryImageGrid } from "@repo/base-ui/masonryImageGrid";

// Example image data
const images = [
  { imageSrc: "https://example.com/image1.jpg", alt: "Image 1" },
  { imageSrc: "https://example.com/image2.jpg", alt: "Image 2" },
  // ...more images
];

export default function MyPage() {
  return (
    <div className="container">
      <h1>My Image Gallery</h1>

      <MasonryImageGrid
        images={images}
        columnWidth={200}
        columnGap={10}
        rowGap={10}
      />
    </div>
  );
}
```

## Props

| Prop          | Type          | Default  | Description                                                                         |
| ------------- | ------------- | -------- | ----------------------------------------------------------------------------------- |
| `images`      | `BaseImage[]` | Required | Array of image objects with `imageSrc` and optional `alt` properties                |
| `columnWidth` | `number`      | `200`    | Width of each column in pixels                                                      |
| `columnCount` | `number`      | Auto     | Number of columns to display (if not provided, calculated based on container width) |
| `columnGap`   | `number`      | `10`     | Horizontal gap between columns in pixels                                            |
| `rowGap`      | `number`      | `10`     | Vertical gap between items in pixels                                                |
| `className`   | `string`      | `''`     | Additional CSS class name                                                           |

## BaseImage Interface

```ts
interface BaseImage {
  imageSrc: string; // URL of the image
  alt?: string; // Optional alt text for accessibility
  width?: number; // Optional width (not used for layout calculations)
  height?: number; // Optional height (not used for layout calculations)
}
```

## Examples

### Basic Usage

```tsx
<MasonryImageGrid images={images} />
```

### Custom Column Width

```tsx
<MasonryImageGrid images={images} columnWidth={250} />
```

### Fixed Column Count

```tsx
<MasonryImageGrid images={images} columnCount={3} />
```

### Custom Spacing

```tsx
<MasonryImageGrid images={images} columnGap={20} rowGap={20} />
```
