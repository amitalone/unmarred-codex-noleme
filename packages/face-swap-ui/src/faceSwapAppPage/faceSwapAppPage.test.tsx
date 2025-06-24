/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { FaceSwapAppPage } from "./faceSwapAppPage";

// Mock React 19 features to be compatible with testing-library
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    // Add any React 19 specific features that need mocking
  };
});

describe("FaceSwapAppPage Component", () => {
  it("renders the title correctly", () => {
    render(<FaceSwapAppPage title="Test Title">Test Content</FaceSwapAppPage>);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders the children content correctly", () => {
    render(<FaceSwapAppPage title="Test Title">Test Content</FaceSwapAppPage>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies the className prop correctly", () => {
    const { container } = render(
      <FaceSwapAppPage title="Test Title" className="custom-class">
        Test Content
      </FaceSwapAppPage>
    );
    const pageElement = container.firstChild;
    expect(pageElement).toHaveClass("face-swap-app-page");
    expect(pageElement).toHaveClass("custom-class");
  });
});
