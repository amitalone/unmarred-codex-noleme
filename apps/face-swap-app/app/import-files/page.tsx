"use client";
import {
  ImportFaceModelPage,
  type SelectedFileInfo,
  createUploadFormData,
} from "@repo/face-swap-ui/importFaceModelPage";
import {
  getDraftImages,
  uploadToDraft,
  acceptDraftImages,
} from "../FaceSwapBFFClient";
import { type ModelImage, type BaseImage } from "@repo/shared-interfaces";
import { useInfiniteData, LoadMoreTrigger } from "@repo/base-ui";

export default function ModelsPage() {
  const {
    data: modelImages,
    isLoading,
    hasMore,
    loadNextPage,
  } = useInfiniteData<ModelImage, [string]>(
    getDraftImages,
    "1", // Base page parameter
    (page) => [page.toString()] // How to construct params with page number
  );

  // Convert ModelImage[] to BaseImage[] for the masonry grid
  const baseImages: BaseImage[] = modelImages || [];

  // Debug log whenever model images change
  console.log(
    `Rendering with ${modelImages?.length || 0} models, loading: ${isLoading}, hasMore: ${hasMore}`
  );

  const handleImageUpload = async (
    selectedFiles: SelectedFileInfo[]
  ): Promise<void> => {
    try {
      console.log("Starting upload process for files:", selectedFiles);

      // Create FormData from selected files
      const formData = createUploadFormData(selectedFiles);

      // Upload to BFF
      const response = await uploadToDraft(formData);

      console.log("Upload successful:", response);

      // TODO: Show success message to user
      // TODO: Refresh the images list
      // TODO: Clear selected files
    } catch (error) {
      console.error("Error uploading files:", error);
      // TODO: Show error message to user
    }
  };

  // Actions for the ImportFaceModelPage
  const actions = {
    onAccept: (importType: string) => {
      console.log("Accept clicked with import type:", importType);
      // TODO: Implement acceptDraft function later
    },
    onUpload: handleImageUpload,
    acceptDraftImages: async (
      selectedDraftImages: import("@repo/shared-interfaces").DraftImage[]
    ) => {
      try {
        console.log("Accepting draft images:", selectedDraftImages);
        const response = await acceptDraftImages(selectedDraftImages);
        console.log("Accept draft images successful:", response);
        // TODO: Show success message to user
        // TODO: Refresh the images list
        // TODO: Clear selected images
      } catch (error) {
        console.error("Error accepting draft images:", error);
        // TODO: Show error message to user
      }
    },
  };

  return (
    <>
      <ImportFaceModelPage
        images={baseImages}
        title="Import Faces/Models"
        actions={actions}
      >
        <LoadMoreTrigger
          onIntersect={loadNextPage}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      </ImportFaceModelPage>
    </>
  );
}
