# Sidebar Component

The Sidebar component is a wrapper around the Flowbite Sidebar component, providing a consistent API for our design system.

## Usage

```jsx
import { Sidebar, SidebarItem } from "@repo/design-system";
import { HiHome, HiUsers } from "react-icons/hi";

export function MyComponent() {
  return (
    <Sidebar>
      <SidebarItem href="/" icon={HiHome}>
        Home
      </SidebarItem>
      <SidebarItem href="/users" icon={HiUsers}>
        Users
      </SidebarItem>
    </Sidebar>
  );
}
```

## Props

The Sidebar component accepts the following props:

| Name      | Type      | Default              | Description                                    |
| --------- | --------- | -------------------- | ---------------------------------------------- |
| children  | ReactNode | required             | Content to be displayed inside the sidebar     |
| className | string    | undefined            | Additional CSS classes to apply to the sidebar |
| collapsed | boolean   | false                | Whether the sidebar is collapsed               |
| aria      | string    | "Navigation sidebar" | Accessibility label for the sidebar            |
| logo      | ReactNode | undefined            | Optional logo component to display at the top  |
