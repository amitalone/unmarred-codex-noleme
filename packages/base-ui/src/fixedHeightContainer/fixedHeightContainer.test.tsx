/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { FixedHeightContainer } from "./fixedHeightContainer";

// Mock React 19 features to be compatible with testing-library
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    // Add any React 19 specific features that need mocking
  };
});

describe("FixedHeightContainer Component", () => {
  it("renders the children correctly", () => {
    render(<FixedHeightContainer>Test Content</FixedHeightContainer>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies the default height of 85vh", () => {
    render(<FixedHeightContainer>Content</FixedHeightContainer>);
    const container = screen.getByTestId("fixed-height-container");
    expect(container.style.height).toBe("85vh");
  });

  it("applies custom height when provided", () => {
    render(<FixedHeightContainer height="50vh">Content</FixedHeightContainer>);
    const container = screen.getByTestId("fixed-height-container");
    expect(container.style.height).toBe("50vh");
  });

  it("applies additional className when provided", () => {
    render(
      <FixedHeightContainer className="custom-class">
        Content
      </FixedHeightContainer>
    );
    const container = screen.getByTestId("fixed-height-container");
    expect(container.className).toContain("custom-class");
  });
});
