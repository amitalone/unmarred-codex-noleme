import { BaseImage, DraftImage } from "@repo/shared-interfaces";

// Helper function to determine if image should be circular
export const isFaceImage = (image: BaseImage): boolean => {
  // Type guard - check if image has a type property
  if (!('type' in image)) return false;
  
  const typedImage = image as BaseImage & { type: string };
  
  // Direct FaceImage
  if (typedImage.type === 'Face') return true;
  
  // DraftImage containing FaceImage
  if (typedImage.type === 'Draft' && 'image' in image) {
    const draftImage = image as DraftImage;
    return draftImage.image.type === 'Face';
  }
  
  return false;
};
