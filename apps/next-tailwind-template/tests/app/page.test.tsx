/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import Page from "../../app/page";

// Mock React 19 features to be compatible with testing-library
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    // Add any React 19 specific features that need mocking
  };
});

// Mock the imported components
jest.mock("@repo/base-ui/card", () => ({
  Card: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid="mocked-card">
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  ),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe("Page Component", () => {
  it("renders the welcome card with correct title", () => {
    render(<Page />);

    // Check if the card title is rendered
    expect(
      screen.getByText("Welcome to The Unmarred Codex of Nólemë!")
    ).toBeInTheDocument();
  });

  it("renders the card content correctly", () => {
    render(<Page />);

    // Check if the card content is rendered
    expect(
      screen.getByText(
        "This is a simple card component built with Tailwind CSS."
      )
    ).toBeInTheDocument();
  });

  it("renders the mocked components", () => {
    render(<Page />);

    // Check if the mocked card is rendered
    expect(screen.getByTestId("mocked-card")).toBeInTheDocument();
  });
});
