/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { ImageActionBar } from "./imageActionBar";
import { BaseImage } from "../types";

// Mock React 19 features to be compatible with testing-library
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    // Add any React 19 specific features that need mocking
  };
});

describe("ImageActionBar Component", () => {
  // Sample image data for testing
  const mockImage: BaseImage = {
    src: "/test-image.jpg",
    alt: "Test Image",
    width: 300,
    height: 200,
  };

  it("renders correctly with default props", () => {
    render(<ImageActionBar image={mockImage} />);

    const actionBar = screen.getByTestId("image-action-bar");
    expect(actionBar).toBeInTheDocument();
    expect(actionBar).toHaveAttribute("role", "toolbar");
    expect(actionBar).toHaveAttribute("aria-label", "Image actions");
  });

  it("applies custom className when provided", () => {
    const customClass = "custom-class";
    render(<ImageActionBar image={mockImage} className={customClass} />);

    const actionBar = screen.getByTestId("image-action-bar");
    expect(actionBar).toHaveClass("image-action-bar");
    expect(actionBar).toHaveClass(customClass);
  });

  it("renders children correctly", () => {
    const childText = "Test Child Element";
    render(
      <ImageActionBar image={mockImage}>
        <span data-testid="test-child">{childText}</span>
      </ImageActionBar>
    );

    const childElement = screen.getByTestId("test-child");
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent(childText);
  });

  it("renders multiple children correctly", () => {
    render(
      <ImageActionBar image={mockImage}>
        <button data-testid="button-1">Button 1</button>
        <button data-testid="button-2">Button 2</button>
        <button data-testid="button-3">Button 3</button>
      </ImageActionBar>
    );

    expect(screen.getByTestId("button-1")).toBeInTheDocument();
    expect(screen.getByTestId("button-2")).toBeInTheDocument();
    expect(screen.getByTestId("button-3")).toBeInTheDocument();
  });
});
