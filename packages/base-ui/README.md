# UI Component Library

This package contains reusable UI components for the project.

## CSS Organization

The UI components in this library use a component-specific CSS approach with BEM naming convention and Tailwind utility classes:

### CSS Structure

1. **Component-specific CSS files**: Each component has its own CSS file (e.g., `card.css` for the Card component).
2. **Global styles**: The main `styles.css` file imports all component-specific CSS files.
3. **BEM naming convention**: CSS classes follow the BEM pattern `block__element--modifier` for better organization.
4. **Tailwind utility classes**: We use Tailwind's `@apply` directive to leverage utility classes.

### How to Add a New Component with CSS

1. Create your component file (e.g., `button.tsx`)
2. Create a corresponding CSS file (e.g., `button.css`) with component-specific styles
3. Add your CSS classes using the BEM naming convention (`button`, `button__icon`, `button--primary`, etc.)
4. Use Tailwind's `@apply` directive to apply utility classes
5. Import your CSS file in `styles.css`
6. Use the CSS classes in your component

### Example

```tsx
// button.tsx
export function Button({ children, variant = "default" }) {
  return <button className={`button button--${variant}`}>{children}</button>;
}
```

```css
/* button.css */
.button {
  @apply px-4 py-2 rounded-md;
}

.button--default {
  @apply bg-blue-500 text-white;
}

.button--primary {
  @apply bg-indigo-600 text-white font-bold;
}
```

```css
/* styles.css */
@import "tailwindcss";
@import "./card.css";
@import "./button.css";
```

### Benefits of This Approach

1. **Separation of concerns**: CSS is separated from component logic
2. **Maintainability**: Easier to find and update styles for a specific component
3. **Reusability**: Components can be used across different projects
4. **Performance**: CSS is bundled and optimized during build
5. **Consistency**: BEM naming convention provides a clear structure
6. **Utility-first**: Leverages Tailwind's utility classes for rapid development
