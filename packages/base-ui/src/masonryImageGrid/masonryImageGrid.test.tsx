import { render, screen, act, fireEvent } from "@testing-library/react";
import { MasonryImageGrid } from "./masonryImageGrid";
import { IconButton } from "../iconButton";
import { IconDelete, IconBodySwapping } from "@repo/design-system/icons";

// Mock ResizeObserver
(window as any).ResizeObserver = class ResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};

// Sample images for testing
const sampleImages = [
  { src: "https://example.com/image1.jpg", alt: "Test image 1" },
  { src: "https://example.com/image2.jpg", alt: "Test image 2" },
  { src: "https://example.com/image3.jpg", alt: "Test image 3" },
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
    expect(container).toHaveStyle({ height: "480px" });

    // Reset timers
    jest.useRealTimers();
  });

  it("renders default action bar with delete button when no custom actions provided", () => {
    render(<MasonryImageGrid images={sampleImages} />);

    // Find the action bars
    const actionBars = document.querySelectorAll(
      ".masonry-image-grid__action-bar"
    );
    expect(actionBars.length).toBe(sampleImages.length);

    // Check for delete buttons
    const deleteButtons = document.querySelectorAll(
      "[data-testid='close-button']"
    );
    expect(deleteButtons.length).toBe(sampleImages.length);
  });

  it("renders custom action buttons when provided", () => {
    const mockOnClick = jest.fn();

    const customActionButtons = [
      <IconButton
        key="delete"
        reactIcon={IconDelete}
        onClick={mockOnClick}
        textColor="text-white"
        shadowClass="shadow-md"
        data-testid="custom-delete-button"
      />,
      <IconButton
        key="swap"
        reactIcon={IconBodySwapping}
        onClick={mockOnClick}
        textColor="text-white"
        shadowClass="shadow-md"
        data-testid="custom-swap-button"
      />,
    ];

    render(
      <MasonryImageGrid
        images={sampleImages}
        actionButtonList={customActionButtons}
      />
    );

    // Check for custom buttons
    const customDeleteButtons = document.querySelectorAll(
      "[data-testid='custom-delete-button']"
    );
    expect(customDeleteButtons.length).toBe(sampleImages.length);

    const customSwapButtons = document.querySelectorAll(
      "[data-testid='custom-swap-button']"
    );
    expect(customSwapButtons.length).toBe(sampleImages.length);

    // Default delete buttons should not be present
    const defaultDeleteButtons = document.querySelectorAll(
      "[data-testid='close-button']"
    );
    expect(defaultDeleteButtons.length).toBe(0);
  });
  it("passes image data to custom action buttons", () => {
    // Create an array to capture all payloads
    const capturedPayloads: any[] = [];

    const TestButton = ({ payload, ...props }: any) => {
      // Store the payload in our array
      capturedPayloads.push(payload);
      return <button data-testid="test-button" {...props} />;
    };

    render(
      <MasonryImageGrid
        images={sampleImages}
        actionButtonList={[<TestButton key="test" />]}
      />
    );

    // Verify we received payloads for all images (twice the expected number due to the
    // component architecture - both the ImageActionBar and the cloneElement add the payload)
    expect(capturedPayloads.length).toBe(sampleImages.length * 2);

    // Check that each image's data was correctly passed to at least one of the buttons
    sampleImages.forEach((image) => {
      expect(capturedPayloads).toContainEqual(image);
    });
  });

  it("applies correct image styling", () => {
    render(<MasonryImageGrid images={sampleImages} />);

    // Check if images have the correct class
    const images = document.querySelectorAll(".masonry-image-grid__image");
    expect(images.length).toBe(sampleImages.length);

    // Check if each image wrapper has the correct class for action bar
    const wrappers = document.querySelectorAll(
      ".masonry-image-grid__image-wrapper.has-image-action-bar"
    );
    expect(wrappers.length).toBe(sampleImages.length);
  });

  it("handles empty images array", () => {
    render(<MasonryImageGrid images={[]} />);

    // Container should still be rendered
    expect(screen.getByTestId("masonry-image-grid")).toBeInTheDocument();
    expect(
      screen.getByTestId("masonry-image-grid-container")
    ).toBeInTheDocument();

    // No images should be rendered
    const items = document.querySelectorAll(".masonry-image-grid__item");
    expect(items.length).toBe(0);
  });
});
