/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { SideBarLayout } from "./sideBarLayout";

// Mock React 19 features to be compatible with testing-library
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    // Add any React 19 specific features that need mocking
  };
});

describe("SideBarLayout Component", () => {
  it("renders the left content with X", () => {
    render(<SideBarLayout>Middle Content</SideBarLayout>);

    expect(screen.getByTestId("sidebar-layout-left-content")).toHaveTextContent(
      "X"
    );
  });

  it("renders the children in the middle column", () => {
    render(<SideBarLayout>Middle Content</SideBarLayout>);

    expect(screen.getByText("Middle Content")).toBeInTheDocument();
  });

  it("renders the right content with Hello", () => {
    render(<SideBarLayout>Middle Content</SideBarLayout>);

    expect(
      screen.getByTestId("sidebar-layout-right-content")
    ).toHaveTextContent("Hello");
  });

  it("applies custom className", () => {
    render(
      <SideBarLayout className="test-class">Middle Content</SideBarLayout>
    );

    const baseLayoutElement = screen.getByTestId("base-layout");
    expect(baseLayoutElement).toHaveClass("sidebar-layout");
    expect(baseLayoutElement).toHaveClass("test-class");
  });
});
