/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { Card } from "./card";

// Mock React 19 features to be compatible with testing-library
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    // Add any React 19 specific features that need mocking
  };
});

describe("Card Component", () => {
  it("renders the title correctly", () => {
    render(<Card title="Test Title">Test Content</Card>);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders the children content correctly", () => {
    render(<Card title="Test Title">Test Content</Card>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies the correct CSS classes", () => {
    const { container } = render(<Card title="Test Title">Test Content</Card>);

    // Check if the card has the correct class
    const cardElement = container.querySelector(".card");
    expect(cardElement).toBeInTheDocument();

    // Check if the title has the correct class
    const titleElement = container.querySelector(".card__title");
    expect(titleElement).toBeInTheDocument();

    // Check if the content has the correct class
    const contentElement = container.querySelector(".card__content");
    expect(contentElement).toBeInTheDocument();
  });
});
