import { useEffect, useRef, useState } from "react";

interface LoadMoreTriggerProps {
  onIntersect: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

export function LoadMoreTrigger({
  onIntersect,
  isLoading,
  hasMore,
}: LoadMoreTriggerProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // If we've already triggered for this page, don't set up a new observer
    if (hasTriggered) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry &&
          entry.isIntersecting &&
          hasMore &&
          !isLoading &&
          !hasTriggered
        ) {
          console.log("Intersection detected, triggering load more once");
          setHasTriggered(true);
          onIntersect();
        }
      },
      { threshold: 0.1 }
    );

    const currentTrigger = triggerRef.current;
    if (currentTrigger) {
      observer.observe(currentTrigger);
    }

    return () => {
      if (currentTrigger) {
        observer.unobserve(currentTrigger);
      }
    };
  }, [onIntersect, isLoading, hasMore, hasTriggered]);

  // Reset the trigger when loading completes
  useEffect(() => {
    if (!isLoading) {
      console.log("Loading completed, resetting trigger");
      setHasTriggered(false);
    }
  }, [isLoading]);

  return (
    <div
      ref={triggerRef}
      className="h-10 w-full flex items-center justify-center"
    >
      {isLoading ? (
        <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
      ) : hasMore ? (
        <span className="text-gray-400">
          {hasTriggered ? "Loading more..." : "Scroll for more"}
        </span>
      ) : (
        <span className="text-gray-400">No more images</span>
      )}
    </div>
  );
}
