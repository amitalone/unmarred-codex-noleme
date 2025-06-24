/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { OutputPage } from "./outputPage";

// Mock the imported components
jest.mock("@repo/base-ui/fixedHeightContainer", () => ({
  FixedHeightContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="fixed-height-container">{children}</div>
  ),
}));

jest.mock("@repo/base-ui/masonryImageGrid", () => ({
  MasonryImageGrid: ({ images }: { images: any[] }) => (
    <div data-testid="masonry-image-grid">{images.length} images</div>
  ),
}));

// Mock React 19 features to be compatible with testing-library
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    // Add any React 19 specific features that need mocking
  };
});

describe("OutputPage Component", () => {
  const mockImages = [
    { imageSrc: "/image1.jpg", alt: "Image 1", type: "face" },
    { imageSrc: "/image2.jpg", alt: "Image 2", type: "face" },
  ];

  it("renders the title correctly", () => {
    render(<OutputPage images={mockImages} />);
    expect(screen.getByText("Output")).toBeInTheDocument();
  });

  it("renders with a custom title", () => {
    render(<OutputPage images={mockImages} title="Custom Output" />);
    expect(screen.getByText("Custom Output")).toBeInTheDocument();
  });

  it("renders the FixedHeightContainer", () => {
    render(<OutputPage images={mockImages} />);
    expect(screen.getByTestId("fixed-height-container")).toBeInTheDocument();
  });

  it("renders the MasonryImageGrid with images", () => {
    render(<OutputPage images={mockImages} />);
    expect(screen.getByTestId("masonry-image-grid")).toBeInTheDocument();
    expect(screen.getByText("2 images")).toBeInTheDocument();
  });
});
