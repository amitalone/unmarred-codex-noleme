# Jest Testing Setup

This monorepo has been configured with Jest for testing React components and applications. The setup includes:

- Shared Jest configuration in the `@repo/jest-config` package
- Test setup for the UI components package
- Test setup for the Next.js application

## Running Tests

You can run tests using the following commands:

```bash
# Run all tests in the monorepo
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests for a specific package
cd packages/ui
pnpm test

# Run tests for the Next.js app
cd apps/next-tailwind-template
pnpm test
```

## Test Structure

Tests are organized as follows:

- UI components: `packages/ui/src/*.test.tsx`
- Next.js app: `apps/next-tailwind-template/app/**/*.test.tsx`

## Configuration

The Jest configuration is shared across packages to reduce duplication:

1. `@repo/jest-config` - Contains the shared Jest preset and setup
2. Each package has its own `jest.config.js` that extends the shared preset

## Writing Tests

### UI Components

Example test for a UI component:

```tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { Card } from "./card";

describe("Card Component", () => {
  it("renders the title correctly", () => {
    render(<Card title="Test Title">Test Content</Card>);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });
});
```

### Next.js Components

Example test for a Next.js page component:

```tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import Page from "./page";

// Mock the imported components
jest.mock("@repo/ui/card", () => ({
  Card: ({ title, children }) => (
    <div data-testid="mocked-card">
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  ),
}));

describe("Page Component", () => {
  it("renders the welcome card with correct title", () => {
    render(<Page />);
    expect(
      screen.getByText("Welcome to the Unmarred Codex!")
    ).toBeInTheDocument();
  });
});
```

## Adding Tests to New Components

1. Create a `.test.tsx` file next to the component you want to test
2. Import the component and testing utilities
3. Write your tests using Jest and React Testing Library
4. Run the tests using `pnpm test`
