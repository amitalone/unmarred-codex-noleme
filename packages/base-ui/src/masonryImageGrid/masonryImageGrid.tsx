"use client";
import { useCallback, useEffect, useRef, useState, Fragment } from "react";
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

export function MasonryImageGrid({
  images,
  columnWidth = 200,
  columnCount,
  columnGap = 10,
  rowGap = 10,
  className = "",
  actionButtonList,
}: MasonryImageGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [positions, setPositions] = useState<{
    [key: number]: { left: number; top: number };
  }>({});
  const [gridHeight, setGridHeight] = useState(0);
  const imageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const columnHeightsRef = useRef<number[]>([]);

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
            key={`${image.imageSrc}-${index}`}
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
            <div className="masonry-image-grid__image-wrapper has-image-action-bar">
              <img
                src={image.imageSrc}
                alt={image.alt || `Image ${index + 1}`}
                className="masonry-image-grid__image"
              />
              {actionButtonList && actionButtonList.length > 0 ? (
                <div className="masonry-image-grid__action-bar">
                  <ImageActionBar image={image}>
                    {" "}
                    {actionButtonList.map((button, btnIndex) => (
                      <Fragment key={`action-button-${btnIndex}`}>
                        {button}
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
    </div>
  );
}
