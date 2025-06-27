import { OutputImage } from "@repo/shared-interfaces";

/**
 * Validates face and model combinations by calling the BFF API
 */
export const validateImageCombinations = async (
  faces: string[],
  models: string[],
  validateCombinationFn: (faces: string[], models: string[]) => Promise<any>
): Promise<OutputImage[]> => {
  if (faces.length === 0 || models.length === 0) {
    return [];
  }

  try {
    const response = await validateCombinationFn(faces, models);
    
    // Assuming the API returns an array of existing combinations
    // The response structure should match OutputImage[]
    if (Array.isArray(response)) {
      return response as OutputImage[];
    }
    
    // Handle different response structures if needed
    if (response?.data && Array.isArray(response.data)) {
      return response.data as OutputImage[];
    }
    
    return [];
  } catch (error) {
    console.error('Error validating combinations:', error);
    return [];
  }
};
