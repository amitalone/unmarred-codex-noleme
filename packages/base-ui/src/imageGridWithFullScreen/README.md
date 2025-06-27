# ImageGridWithFullScreen Component

The `ImageGridWithFullScreen` component combines a `MasonryImageGrid` with a `FullscreenImageViewer` that opens when an image is clicked.

## Features

- All features of the `MasonryImageGrid` component
- Automatic integration with `FullscreenImageViewer` for a seamless full-screen experience
- Image navigation with arrow keys and close with ESC key
- Optional image information display

## Props

| Prop               | Type                | Default  | Description                                                                         |
| ------------------ | ------------------- | -------- | ----------------------------------------------------------------------------------- |
| `images`           | `BaseImage[]`       | Required | Array of image objects with `src` and optional `alt` properties                     |
| `columnWidth`      | `number`            | `200`    | Width of each column in pixels                                                      |
| `columnCount`      | `number`            | Auto     | Number of columns to display (if not provided, calculated based on container width) |
| `columnGap`        | `number`            | `10`     | Horizontal gap between columns in pixels                                            |
| `rowGap`           | `number`            | `10`     | Vertical gap between items in pixels                                                |
| `className`        | `string`            | `''`     | Additional CSS class name                                                           |
| `showImageInfo`    | `boolean`           | `false`  | Whether to show image information in fullscreen view                                |
| `actionButtonList` | `React.ReactNode[]` | Optional | Custom action buttons to display for each image                                     |

## BaseImage Interface

```ts
interface BaseImage {
  src: string; // URL of the image
  alt?: string; // Optional alt text for accessibility
  width?: number; // Optional width (not used for layout calculations)
  height?: number; // Optional height (not used for layout calculations)
  name: string; // Name of the image
}
```

## Examples

### Basic Usage

```tsx
import { ImageGridWithFullScreen } from "@repo/base-ui/imageGridWithFullScreen";

// Image data
const images = [
  { src: "https://example.com/image1.jpg", alt: "Image 1", name: "image1.jpg" },
  { src: "https://example.com/image2.jpg", alt: "Image 2", name: "image2.jpg" },
  // ...more images
];

export default function MyPage() {
  return (
    <div className="container">
      <h1>My Image Gallery</h1>
      <ImageGridWithFullScreen images={images} />
    </div>
  );
}
```

### With Image Info

```tsx
<ImageGridWithFullScreen images={images} showImageInfo={true} columnCount={3} />
```

### With Custom Action Buttons

```tsx
import { IconButton } from "@repo/base-ui/iconButton";
import { IconDelete, IconEdit } from "@repo/design-system/icons";

const actionButtons = [
  <IconButton
    key="delete"
    reactIcon={IconDelete}
    onClick={(e, props) => handleDelete(props.payload)}
  />,
  <IconButton
    key="edit"
    reactIcon={IconEdit}
    onClick={(e, props) => handleEdit(props.payload)}
  />,
];

<ImageGridWithFullScreen images={images} actionButtonList={actionButtons} />;
```
