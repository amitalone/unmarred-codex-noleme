# Design System

A shared design system package for the repository.

Why not use Flowbite direct ? Cause they keep changing, keep your options open.

## Components

- Button: A customizable button component with a pink background

## Usage

```jsx
import { Button } from "@repo/design-system/button";
import "@repo/design-system/styles.css";

export function MyComponent() {
  return (
    <Button onClick={() => console.log("Button clicked")}>Click Me</Button>
  );
}
```

## Development

```bash
# Build the package
pnpm build

# Run tests
pnpm test

# Run mutation tests
pnpm mutation
```
