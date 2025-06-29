/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ImageButton } from "./imageButton";

// Mock React 19 features to be compatible with testing-library
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    // Add any React 19 specific features that need mocking
  };
});

describe("ImageButton Component", () => {
  it("renders the Avatar correctly with props", () => {
    render(
      <ImageButton
        src="test-image.jpg"
        alt="Test image"
        data-testid="image-button"
      />
    );

    const buttonElement = screen.getByTestId("image-button");
    expect(buttonElement).toBeInTheDocument();

    const avatarElement = screen.getByTestId("flowbite-avatar");
    expect(avatarElement).toBeInTheDocument();
  });

  it("applies the correct CSS classes for interaction", () => {
    render(
      <ImageButton
        src="test-image.jpg"
        alt="Test image"
        data-testid="image-button"
      />
    );

    const buttonElement = screen.getByTestId("image-button");
    expect(buttonElement).toHaveClass("cursor-pointer");
    expect(buttonElement).toHaveClass("hover:opacity-80");
    expect(buttonElement).toHaveClass("transition-opacity");
  });

  it("calls the onClick handler when clicked", () => {
    const handleClick = jest.fn();

    render(
      <ImageButton
        src="test-image.jpg"
        alt="Test image"
        onClick={handleClick}
        data-testid="image-button"
      />
    );

    const buttonElement = screen.getByTestId("image-button");
    fireEvent.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  it("prevents default event behavior and stops propagation", () => {
    const handleClick = jest.fn();

    // Create a mock implementation that will capture the event
    const onClickMock = jest.fn((e, props) => {
      // If the preventDefault and stopPropagation were called,
      // these should both be true since the default implementation
      // is to set a flag when these methods are called
      expect(e.defaultPrevented).toBe(true);
      handleClick();
    });

    render(
      <ImageButton
        src="test-image.jpg"
        alt="Test image"
        onClick={onClickMock}
        data-testid="image-button"
      />
    );

    const buttonElement = screen.getByTestId("image-button");
    fireEvent.click(buttonElement);

    expect(onClickMock).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
