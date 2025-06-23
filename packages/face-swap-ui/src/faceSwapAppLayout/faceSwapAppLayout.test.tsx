/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { FaceSwapAppLayout } from "./faceSwapAppLayout";

// Mock React 19 features to be compatible with testing-library
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    // Add any React 19 specific features that need mocking
  };
});

// Mock SideBarLayout as it's imported from another package
jest.mock("@repo/base-ui/sideBarLayout", () => ({
  SideBarLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mocked-sidebar-layout">{children}</div>
  ),
}));

describe("FaceSwapAppLayout Component", () => {
  it("renders the component with correct classes", () => {
    const { container } = render(
      <FaceSwapAppLayout>Test Content</FaceSwapAppLayout>
    );

    const layoutElement = screen.getByTestId("face-swap-app-layout");
    expect(layoutElement).toHaveClass("face-swap-app-layout");
  });

  it("renders the children content correctly", () => {
    render(<FaceSwapAppLayout>Test Content</FaceSwapAppLayout>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <FaceSwapAppLayout className="test-class">Test Content</FaceSwapAppLayout>
    );

    const layoutElement = screen.getByTestId("face-swap-app-layout");
    expect(layoutElement).toHaveClass("face-swap-app-layout");
    expect(layoutElement).toHaveClass("test-class");
  });

  it("renders within the SideBarLayout", () => {
    render(<FaceSwapAppLayout>Test Content</FaceSwapAppLayout>);
    expect(screen.getByTestId("mocked-sidebar-layout")).toBeInTheDocument();
  });
});
