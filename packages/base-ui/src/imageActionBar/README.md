# ImageActionBar Component

The `ImageActionBar` component provides a UI element that appears when hovering over an image.

## Important: Fixing the "Black Box" Issue

If you're seeing just a black box at the bottom of your image, make sure:

1. Your parent container has the `has-image-action-bar` class
2. The icons are properly loaded
3. The parent has `position: relative` set
4. The image itself doesn't have any unexpected margins or paddings
5. Check the element in your browser's developer tools to identify any CSS issues

## Basic Usage

```tsx
import { ImageWithActionBar } from "@repo/base-ui";

// Example image data
const image = {
  id: "1",
  url: "/path/to/image.jpg",
  alt: "Example image",
};

function MyComponent() {
  return (
    <div className="w-64 h-64">
      <ImageWithActionBar image={image} />
    </div>
  );
}
```

## Using the ImageActionBar Directly

If you need more control over when the action bar appears, you can use the `ImageActionBar` component directly:

```tsx
import { ImageActionBar } from "@repo/base-ui";

function MyCustomImageComponent({ image }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="has-image-action-bar"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={image.url} alt={image.alt} />
      <ImageActionBar image={image} isVisible={isHovered} />
    </div>
  );
}
```

## Props

### ImageActionBar Props

| Prop      | Type                         | Default   | Description                              |
| --------- | ---------------------------- | --------- | ---------------------------------------- |
| image     | BaseImage                    | required  | The image data                           |
| actions   | ReactNode                    | undefined | Custom actions to display in the bar     |
| className | string                       | ""        | Additional CSS classes                   |
| position  | "top" \| "bottom"            | "bottom"  | Position of the action bar               |
| alignment | "start" \| "center" \| "end" | "center"  | Horizontal alignment of actions          |
| isVisible | boolean                      | false     | Controls visibility when not using hover |

### ImageWithActionBar Props

| Prop      | Type      | Default  | Description                          |
| --------- | --------- | -------- | ------------------------------------ |
| image     | BaseImage | required | The image data                       |
| className | string    | ""       | Additional CSS classes for the image |
| alt       | string    | ""       | Alt text for the image               |

## Styling

To ensure proper hover behavior, make sure to:

1. Add the `has-image-action-bar` class to the parent container
2. Position the parent container as `relative` if not using the `has-image-action-bar` class
