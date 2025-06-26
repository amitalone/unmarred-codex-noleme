"use client";
import { ImageGalleryPagePage } from "@repo/face-swap-ui/imageGalleryPage";
import { getModels } from "../FaceSwapBFFClient";
import { type ModelImage } from "@repo/shared-interfaces";
import { useInfiniteData, LoadMoreTrigger } from "@repo/base-ui";

export default function ModelsPage() {
  const {
    data: modelImages,
    isLoading,
    hasMore,
    loadNextPage,
  } = useInfiniteData<ModelImage, [string]>(
    getModels,
    "1", // Base page parameter
    (page) => [page.toString()] // How to construct params with page number
  );

  // Debug log whenever model images change
  console.log(
    `Rendering with ${modelImages?.length || 0} models, loading: ${isLoading}, hasMore: ${hasMore}`
  );

  return (
    <>
      <ImageGalleryPagePage images={modelImages || []} title="Models Gallery">
        <LoadMoreTrigger
          onIntersect={loadNextPage}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      </ImageGalleryPagePage>
    </>
  );
}
