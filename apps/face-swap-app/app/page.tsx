"use client";
import { OutputPage } from "@repo/face-swap-ui/outputPage";
import { resultsByPathURL } from "./FaceSwapBFFClient";
import { type OutputImage } from "@repo/shared-interfaces";
import { useInfiniteData, LoadMoreTrigger } from "@repo/base-ui";

export default function ResultsPage() {
  const {
    data: resultImages,
    isLoading,
    hasMore,
    loadNextPage,
  } = useInfiniteData<OutputImage, [string, string]>(
    resultsByPathURL,
    "2025", // Base year parameter
    (page) => ["2025", page.toString()] // How to construct params with page number
  );

  // Debug log whenever result images change
  console.log(
    `Rendering with ${resultImages?.length || 0} images, loading: ${isLoading}, hasMore: ${hasMore}`
  );

  return (
    <>
      <OutputPage images={resultImages || []} title="Results Gallery">
        <LoadMoreTrigger
          onIntersect={loadNextPage}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      </OutputPage>
    </>
  );
}
