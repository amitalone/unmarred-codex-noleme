import { useState, useCallback, useMemo } from 'react';
import { BaseImage, DraftImage } from '@repo/shared-interfaces';

export function useDraftImageSelection(images: BaseImage[]) {
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(() => {
    // Initialize with all draft images selected by default
    const draftImageIds = images
      .filter(img => (img as any).type === 'Draft')
      .map((img, index) => index.toString()); // Use index as ID since BaseImage doesn't have id
    console.log("Initializing draft image selection with:", draftImageIds);
    return new Set(draftImageIds);
  });

  const handleImageSelectionChange = useCallback((imageIndex: number, isSelected: boolean) => {
    const imageId = imageIndex.toString();
    setSelectedImageIds(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(imageId);
      } else {
        newSet.delete(imageId);
      }
      return newSet;
    });
  }, []);

  const imagesWithSelection = useMemo(() => {
    return images.map((image, index) => ({
      ...image,
      isSelected: selectedImageIds.has(index.toString())
    }));
  }, [images, selectedImageIds]);

  const getSelectedImages = useCallback(() => {
    return images.filter((_, index) => selectedImageIds.has(index.toString()));
  }, [images, selectedImageIds]);

  const getSelectedImageNames = useCallback(() => {
    const selectedImages = images
      .filter((_, index) => selectedImageIds.has(index.toString()))
      .map(img => img.name);
    console.log("getSelectedImageNames called. Selected IDs:", Array.from(selectedImageIds));
    console.log("Total images:", images.length);
    console.log("Selected image names:", selectedImages);
    return selectedImages;
  }, [images, selectedImageIds]);

  const getSelectedDraftImages = useCallback(() => {
    const selectedImages = images
      .filter((_, index) => selectedImageIds.has(index.toString()))
      .filter(img => (img as any).type === 'Draft') as DraftImage[];
    console.log("getSelectedDraftImages called. Selected IDs:", Array.from(selectedImageIds));
    console.log("Total images:", images.length);
    console.log("Selected draft images:", selectedImages);
    return selectedImages;
  }, [images, selectedImageIds]);

  return {
    imagesWithSelection,
    handleImageSelectionChange,
    getSelectedImages,
    getSelectedImageNames,
    getSelectedDraftImages,
    selectedCount: selectedImageIds.size
  };
}
