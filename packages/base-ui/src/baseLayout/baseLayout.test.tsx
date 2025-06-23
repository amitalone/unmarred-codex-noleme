/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { BaseLayout } from "./baseLayout";

// Mock React 19 features to be compatible with testing-library
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    // Add any React 19 specific features that need mocking
  };
});

describe("BaseLayout Component", () => {
  it("renders the middle column correctly", () => {
    render(<BaseLayout middleColumn={<div>Middle Content</div>} />);
    expect(screen.getByText("Middle Content")).toBeInTheDocument();
  });

  it("renders all columns when provided", () => {
    render(
      <BaseLayout
        leftColumn={<div>Left Content</div>}
        middleColumn={<div>Middle Content</div>}
        rightColumn={<div>Right Content</div>}
      />
    );
    expect(screen.getByText("Left Content")).toBeInTheDocument();
    expect(screen.getByText("Middle Content")).toBeInTheDocument();
    expect(screen.getByText("Right Content")).toBeInTheDocument();
  });
  it("doesn't render left and right columns when not provided", () => {
    render(<BaseLayout middleColumn={<div>Middle Content</div>} />);

    // Check that only middle column content is present
    expect(screen.getByText("Middle Content")).toBeInTheDocument();

    // Check that left and right columns don't exist
    const leftColumn = screen.queryByTestId("base-layout-left-column");
    const rightColumn = screen.queryByTestId("base-layout-right-column");
    expect(leftColumn).not.toBeInTheDocument();
    expect(rightColumn).not.toBeInTheDocument();
  });
  it("applies additional className when provided", () => {
    render(
      <BaseLayout
        middleColumn={<div>Middle Content</div>}
        className="test-class"
      />
    );

    // Check that the custom class is applied
    const baseLayout = screen.getByTestId("base-layout");
    expect(baseLayout).toHaveClass("test-class");
  });
});
