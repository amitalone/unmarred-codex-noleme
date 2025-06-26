"use client";
import { ImageGalleryPagePage } from "@repo/face-swap-ui/imageGalleryPage";
import { getFaces } from "../FaceSwapBFFClient";
import { type FaceImage } from "@repo/shared-interfaces";
import { useInfiniteData, LoadMoreTrigger } from "@repo/base-ui";

export default function FacesPage() {
  const {
    data: faceImages,
    isLoading,
    hasMore,
    loadNextPage,
  } = useInfiniteData<FaceImage, [string]>(
    getFaces,
    "1", // Base page parameter
    (page) => [page.toString()] // How to construct params with page number
  );

  // Debug log whenever face images change
  console.log(
    `Rendering with ${faceImages?.length || 0} faces, loading: ${isLoading}, hasMore: ${hasMore}`
  );

  return (
    <>
      <ImageGalleryPagePage images={faceImages || []} title="Faces Gallery">
        <LoadMoreTrigger
          onIntersect={loadNextPage}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      </ImageGalleryPagePage>
    </>
  );
}
