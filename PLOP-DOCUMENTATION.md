# Using Plop in Unmarred Codex of Nólemë

This documentation provides a comprehensive guide on how to use Plop in this project to generate new applications and UI component libraries.

## What is Plop?

Plop is a micro-generator framework that makes it easy to create files in your project by running simple commands. In this project, Plop is configured to generate two types of applications:

1. Next.js applications with App Router and Flowbite
2. UI component libraries

## Prerequisites

- Node.js (latest LTS version recommended)
- pnpm package manager

## Getting Started

### Installing Dependencies

After cloning the repository, install the dependencies:

```bash
pnpm install
```

## Creating a New Application

To create a new application using Plop, run the following command in the root directory of the project:

```bash
npx plop application
```

You will be prompted to answer a few questions:

1. **What is the name of your application?** (in kebab-case format)

   - Example: `my-new-app`

2. **Which type of application would you like to create?**

   - Choose from:
     - `nextjs-app-router-flowbite`: A Next.js application with App Router and Flowbite
     - `ui-component-library`: A UI component library

3. **Which port would you like to use for the dev server?** (Only for Next.js applications)
   - Default: `3001`

After answering these questions, Plop will generate the application with all the necessary files and configurations.

### Post-Generation Steps

After generating a new application, you need to install dependencies:

```bash
pnpm install
```

## Running a New Application

### Next.js Application

To run a newly created Next.js application:

```bash
cd apps/my-new-app
pnpm dev
```

Or from the root directory:

```bash
pnpm --filter @repo/my-new-app dev
```

This will start the development server at the port you specified during creation (default: 3001).

### UI Component Library

For UI component libraries, you can run the development build:

```bash
cd packages/my-new-ui-lib
pnpm dev
```

Or from the root directory:

```bash
pnpm --filter @repo/my-new-ui-lib dev
```

## Including UI Components in Other Apps

### How to Import UI Components

UI components from a library can be imported into other applications using the package name and component path.

For example, to import a component from the `base-ui` package:

```tsx
import { Card } from "@repo/base-ui/card";
```

### Example Usage

Here's an example of how to use the Card component from base-ui in a Next.js application:

```tsx
import { Card } from "@repo/base-ui/card";

export default function Page() {
  return (
    <Card title="My Card Title">
      <p>This is the content of my card.</p>
    </Card>
  );
}
```

### Importing Styles

If your UI component library has styles, you need to import them in your application. For example, in a Next.js app's layout.tsx:

```tsx
import "@repo/base-ui/styles.css";
```

## Project Structure

After generating applications, they will be placed in the following directories:

- Next.js applications: `apps/my-new-app`
- UI component libraries: `packages/my-new-ui-lib`

## Building Components

To build a UI component library:

```bash
cd packages/my-new-ui-lib
pnpm build
```

Or from the root directory:

```bash
pnpm --filter @repo/my-new-ui-lib build
```

This will build both the styles and the components.

## Testing

Each generated application comes with Jest configured for testing:

```bash
cd apps/my-new-app
pnpm test
```

Or from the root directory:

```bash
pnpm --filter @repo/my-new-app test
```

## Conclusion

Plop makes it easy to generate new applications and UI component libraries with consistent structure and configuration. By following this documentation, you can quickly create and run new applications in this project.
