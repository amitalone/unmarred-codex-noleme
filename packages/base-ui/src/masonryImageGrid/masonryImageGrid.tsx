"use client";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  Fragment,
} from "react";
import { MasonryImageGridProps } from "../types";
import { createCellPositioner } from "./createCellPositioner";
import { ImageActionBar } from "../imageActionBar";
import { IconButton } from "../iconButton";
import {
  IconDelete,
  IconBodySwapping,
  IconMenu,
} from "@repo/design-system/icons";
import { Children } from "react";
import { FullscreenImageViewer } from "../fullScreenImageViewer";
import { isFaceImage } from "../utils/imageUtils";

export function MasonryImageGrid({
  images,
  columnWidth = 200,
  columnCount,
  columnGap = 10,
  rowGap = 10,
  className = "",
  actionButtonList,
  onScrollEnd,
  isLoading = false,
  onImageClick,
  onImageSelectionChange,
}: MasonryImageGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [positions, setPositions] = useState<{
    [key: number]: { left: number; top: number };
  }>({});
  const [gridHeight, setGridHeight] = useState(0);
  const imageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const columnHeightsRef = useRef<number[]>([]);
  const lastScrollY = useRef<number>(0);
  const scrollThreshold = 200; // pixels from bottom to trigger load more
  const scrollTimer = useRef<number | null>(null);

  // Calculate how many columns to display based on container width
  const calculateColumnCount = useCallback(() => {
    if (!containerRef.current) return 0;

    const calculatedColumnCount =
      columnCount ||
      Math.floor(containerRef.current.offsetWidth / (columnWidth + columnGap));

    return Math.max(1, calculatedColumnCount);
  }, [columnCount, columnWidth, columnGap]);

  // Initialize/reset column heights tracking array
  const resetColumnHeights = useCallback((count: number) => {
    columnHeightsRef.current = Array(count).fill(0);
  }, []);

  // Calculate positions for all images
  const calculatePositions = useCallback(() => {
    if (!containerRef.current || images.length === 0) return;

    const actualColumnCount = calculateColumnCount();
    resetColumnHeights(actualColumnCount);

    const cellPositioner = createCellPositioner({
      columnCount: actualColumnCount,
      columnWidth,
      spacer: columnGap,
    });

    const newPositions: { [key: number]: { left: number; top: number } } = {};
    let maxHeight = 0;

    // Position each image
    images.forEach((image, index) => {
      const imageEl = imageRefs.current.get(index);
      if (!imageEl) return;

      const height = imageEl.offsetHeight;
      const { left, top } = cellPositioner(index, height);

      newPositions[index] = { left, top };

      // Track the maximum height for setting the container height
      const bottomEdge = top + height + rowGap;
      maxHeight = Math.max(maxHeight, bottomEdge);
    });

    setPositions(newPositions);
    setGridHeight(maxHeight);
  }, [
    images,
    columnWidth,
    columnGap,
    rowGap,
    calculateColumnCount,
    resetColumnHeights,
  ]);

  // Handle resize
  const handleResize = useCallback(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }
  }, []);

  // Set up resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Initial measurement
    handleResize();

    return () => {
      resizeObserver.disconnect();
    };
  }, [handleResize]);

  // Calculate positions when width or images change
  useEffect(() => {
    if (width > 0 && images.length > 0) {
      // Allow images to render first, then calculate positions
      const timer = setTimeout(() => {
        calculatePositions();
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [width, images, calculatePositions]);

  // Store refs to image elements to measure their height
  const setImageRef = useCallback(
    (element: HTMLDivElement | null, index: number) => {
      if (element) {
        imageRefs.current.set(index, element);
      } else {
        imageRefs.current.delete(index);
      }
    },
    []
  );

  // Handle checkbox change for draft images
  const handleCheckboxChange = useCallback(
    (index: number, isSelected: boolean) => {
      onImageSelectionChange?.(index, isSelected);
    },
    [onImageSelectionChange]
  );

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!onScrollEnd || isLoading) return;

    const scrollY = window.scrollY;
    const direction = scrollY > lastScrollY.current ? "down" : "up";
    lastScrollY.current = scrollY;

    // Clear existing timer
    if (scrollTimer.current !== null) {
      window.clearTimeout(scrollTimer.current);
    }

    // Set a new timer to detect when scrolling stops
    scrollTimer.current = window.setTimeout(() => {
      // Check if we're near the bottom of the page
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrolledToBottom =
        scrollY + windowHeight >= documentHeight - scrollThreshold;

      // Check if we're near the top of the page
      const scrolledToTop = scrollY < scrollThreshold;

      if (
        (direction === "down" && scrolledToBottom) ||
        (direction === "up" && scrolledToTop)
      ) {
        onScrollEnd(direction);
      }
    }, 200); // Debounce for 200ms
  }, [onScrollEnd, isLoading]);

  // Add scroll event listener
  useEffect(() => {
    if (onScrollEnd) {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll, onScrollEnd]);

  return (
    <div
      ref={containerRef}
      className={`masonry-image-grid ${className}`}
      data-testid="masonry-image-grid"
    >
      <div
        className="masonry-image-grid__container"
        style={{ height: `${gridHeight}px`, position: "relative" }}
        data-testid="masonry-image-grid-container"
      >
        {images.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            ref={(el) => setImageRef(el, index)}
            className="masonry-image-grid__item"
            style={{
              position: "absolute",
              width: `${columnWidth}px`,
              left: positions[index]?.left ?? 0,
              top: positions[index]?.top ?? 0,
              transform:
                Object.keys(positions).length > 0 ? "none" : "translateY(10px)",
              opacity: Object.keys(positions).length > 0 ? 1 : 0,
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
            data-testid={`masonry-image-grid-item-${index}`}
          >
            {" "}
            <div
              className={`masonry-image-grid__image-wrapper has-image-action-bar ${
                image.isSelected
                  ? "masonry-image-grid__image-wrapper--selected"
                  : ""
              }`}
            >
              {" "}
              <img
                src={image.src}
                alt={image.alt || `Image ${index + 1}`}
                className={`masonry-image-grid__image ${
                  isFaceImage(image)
                    ? "masonry-image-grid__image--circular"
                    : ""
                }`}
                loading="lazy"
                onClick={() => onImageClick && onImageClick(index)}
                style={{ cursor: "pointer" }}
              />
              {/* Checkbox for draft images */}
              {(image as any).type === "Draft" && (
                <div className="masonry-image-grid__checkbox-container">
                  <input
                    type="checkbox"
                    className="masonry-image-grid__checkbox"
                    checked={image.isSelected ?? false}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleCheckboxChange(index, e.target.checked);
                    }}
                  />
                </div>
              )}
              {actionButtonList && actionButtonList.length > 0 ? (
                <div className="masonry-image-grid__action-bar">
                  <ImageActionBar image={image}>
                    {" "}
                    {actionButtonList.map((button, btnIndex) => (
                      <Fragment key={`action-button-${btnIndex}`}>
                        {React.cloneElement(button as React.ReactElement)}
                      </Fragment>
                    ))}
                  </ImageActionBar>
                </div>
              ) : (
                <div className="masonry-image-grid__action-bar">
                  <ImageActionBar image={image}>
                    <IconButton
                      reactIcon={IconDelete}
                      textColor="text-white"
                      shadowClass="shadow-md"
                      data-testid="close-button"
                    />
                  </ImageActionBar>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {isLoading && (
        <div className="masonry-image-grid__loading-indicator flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}
