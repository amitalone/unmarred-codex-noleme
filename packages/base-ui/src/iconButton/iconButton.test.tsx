/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { IconButton } from "./iconButton";
import { IconClose } from "@repo/design-system/icons"; // Using an icon from design-system package

// Mock React 19 features to be compatible with testing-library
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    // Add any React 19 specific features that need mocking
  };
});

describe("IconButton Component", () => {
  it("renders the icon correctly", () => {
    render(
      <IconButton
        reactIcon={IconClose}
        textColor="text-white"
        shadowClass="shadow-md"
        data-testid="close-icon"
      />
    );

    const iconElement = screen.getByTestId("close-icon");
    expect(iconElement).toBeInTheDocument();
  });
  it("applies the correct default CSS classes", () => {
    render(
      <IconButton
        reactIcon={IconClose}
        textColor="text-white"
        shadowClass="shadow-md"
        data-testid="close-icon"
      />
    );

    const iconElement = screen.getByTestId("close-icon");
    expect(iconElement).toHaveClass("text-white");
    expect(iconElement).toHaveClass("cursor-pointer");
    expect(iconElement).toHaveClass("rounded-full");
  });
  it("calls the onClick handler when clicked", () => {
    const handleClick = jest.fn();

    render(
      <IconButton
        reactIcon={IconClose}
        textColor="text-white"
        shadowClass="shadow-md"
        onClick={handleClick}
        data-testid="close-icon"
      />
    );

    const iconElement = screen.getByTestId("close-icon");
    fireEvent.click(iconElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  it("prevents default event behavior when clicked", () => {
    const handleClick = jest.fn();

    // Create spies for the event methods
    const preventDefault = jest.spyOn(Event.prototype, "preventDefault");
    const stopPropagation = jest.spyOn(Event.prototype, "stopPropagation");

    // Clear the mock calls before our test
    preventDefault.mockClear();
    stopPropagation.mockClear();

    render(
      <IconButton
        reactIcon={IconClose}
        textColor="text-white"
        shadowClass="shadow-md"
        onClick={handleClick}
        data-testid="close-icon"
      />
    );

    const iconElement = screen.getByTestId("close-icon");
    fireEvent.click(iconElement);

    // Verify our event methods were called
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(stopPropagation).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  it("renders with the correct size prop", () => {
    // Mock IconClose to capture the props passed to it
    const mockIconClose = jest.fn();
    mockIconClose.mockReturnValue(<div data-testid="close-icon"></div>);

    render(
      <IconButton
        reactIcon={mockIconClose}
        textColor="text-white"
        shadowClass="shadow-md"
        data-testid="close-icon"
      />
    ); // Check that the size prop was passed correctly
    expect(mockIconClose).toHaveBeenCalledWith(
      expect.objectContaining({
        size: 36,
        className: expect.any(String),
        "data-testid": "close-icon",
        onClick: expect.any(Function),
      }),
      undefined
    );
  });
});
