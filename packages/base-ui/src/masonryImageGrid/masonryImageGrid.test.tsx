import { render, screen, act } from "@testing-library/react";
import { MasonryImageGrid } from "./masonryImageGrid";

// Mock ResizeObserver
(window as any).ResizeObserver = class ResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};

// Sample images for testing
const sampleImages = [
  { imageSrc: "https://example.com/image1.jpg", alt: "Test image 1" },
  { imageSrc: "https://example.com/image2.jpg", alt: "Test image 2" },
  { imageSrc: "https://example.com/image3.jpg", alt: "Test image 3" },
];

describe("MasonryImageGrid", () => {
  beforeEach(() => {
    // Mock clientWidth/offsetWidth
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: 800,
    }); // Mock offsetHeight with different heights
    jest
      .spyOn(HTMLElement.prototype, "offsetHeight", "get")
      .mockImplementation(function (this: HTMLElement) {
        // Return different heights based on class
        if (this.classList.contains("masonry-image-grid__item")) {
          // Get the index from the data-testid
          const testId = this.getAttribute("data-testid") || "";
          const index = parseInt(
            testId.replace("masonry-image-grid-item-", ""),
            10
          );

          // Return different heights based on index to simulate various image heights
          return [200, 300, 250][index] || 200;
        }
        return 100;
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the component with correct structure", () => {
    render(<MasonryImageGrid images={sampleImages} />);

    expect(screen.getByTestId("masonry-image-grid")).toBeInTheDocument();
    expect(
      screen.getByTestId("masonry-image-grid-container")
    ).toBeInTheDocument();
  });

  it("renders all images", () => {
    render(<MasonryImageGrid images={sampleImages} />);

    sampleImages.forEach((_, index) => {
      expect(
        screen.getByTestId(`masonry-image-grid-item-${index}`)
      ).toBeInTheDocument();
    });
  });

  it("uses alt text for images when provided", () => {
    render(<MasonryImageGrid images={sampleImages} />);

    sampleImages.forEach((image) => {
      expect(screen.getByAltText(image.alt as string)).toBeInTheDocument();
    });
  });

  it("applies custom className", () => {
    render(<MasonryImageGrid images={sampleImages} className="test-class" />);

    const gridElement = screen.getByTestId("masonry-image-grid");
    expect(gridElement).toHaveClass("masonry-image-grid");
    expect(gridElement).toHaveClass("test-class");
  });

  it("calculates positions after layout", async () => {
    // We need to wait for the setTimeout that triggers position calculation
    jest.useFakeTimers();

    render(
      <MasonryImageGrid
        images={sampleImages}
        columnWidth={300}
        columnGap={20}
      />
    );

    // Fast-forward timers to trigger position calculation
    act(() => {
      jest.runAllTimers();
    });

    // Check that the container has a height set
    const container = screen.getByTestId("masonry-image-grid-container");
    expect(container).toHaveStyle({ height: expect.any(String) });

    // Reset timers
    jest.useRealTimers();
  });
});
