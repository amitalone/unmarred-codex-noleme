# Drawer Component

The Drawer component is a wrapper around the Flowbite Drawer component, providing a consistent API for our design system.

## Usage

```tsx
import { useState } from "react";
import { Drawer, Button } from "@repo/design-system";

function Example() {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      <Button text="Open Drawer" onClick={openDrawer} />

      <Drawer
        open={isOpen}
        onClose={closeDrawer}
        title="Example Drawer"
        placement="right"
      >
        <p>This is the content of the drawer.</p>
        <Button text="Close" onClick={closeDrawer} />
      </Drawer>
    </>
  );
}
```

## Props

The Drawer component accepts the following props:

| Prop      | Type                                   | Default   | Description                                   |
| --------- | -------------------------------------- | --------- | --------------------------------------------- |
| open      | boolean                                | required  | Controls whether the drawer is visible        |
| onClose   | () => void                             | required  | Function called when the drawer is closed     |
| placement | 'left' \| 'right' \| 'top' \| 'bottom' | 'right'   | The position of the drawer                    |
| title     | string                                 | undefined | Optional title displayed in the drawer header |
| children  | ReactNode                              | required  | Content to be displayed inside the drawer     |
| className | string                                 | undefined | Additional CSS classes to apply to the drawer |
