import { DraftImageImportBody } from "@repo/shared-interfaces";
import { SelectedFileInfo } from "../importFaceModelPage/importFaceModelPage.event.handler";

/**
 * Creates a DraftImageImportBody from selected file information
 * @param selectedFiles Array of selected files with their import type
 * @returns DraftImageImportBody ready to be sent to the server
 */
export const createDraftImageImportBody = (selectedFiles: SelectedFileInfo[]): DraftImageImportBody => {
  if (selectedFiles.length === 0) {
    throw new Error("No files selected for upload");
  }

  // All files should have the same import type in the current implementation
  const firstFile = selectedFiles[0];
  if (!firstFile) {
    throw new Error("No files selected for upload");
  }
  
  const importType = firstFile.importType;
  
  // Validate that all files have the same import type
  const hasConsistentImportType = selectedFiles.every(fileInfo => fileInfo.importType === importType);
  if (!hasConsistentImportType) {
    throw new Error("All selected files must have the same import type");
  }

  return {
    importType: [{ value: importType }],
    files: selectedFiles.map(fileInfo => fileInfo.file)
  };
};

/**
 * Creates FormData from DraftImageImportBody for multipart/form-data upload
 * @param importBody The import body containing files and metadata
 * @returns FormData ready to be sent via HTTP
 */
export const createFormDataFromImportBody = (importBody: DraftImageImportBody): FormData => {
  const formData = new FormData();
  
  // Add import type as array fields (fastify multipart with attachFieldsToBody expects this format)
  importBody.importType.forEach((typeItem, index) => {
    formData.append(`importType[${index}][value]`, typeItem.value);
  });
  
  // Add each file
  importBody.files.forEach((file, index) => {
    formData.append(`files`, file);
  });
  
  return formData;
};

/**
 * High-level utility function to create FormData from selected files
 * @param selectedFiles Array of selected files with their import type
 * @returns FormData ready to be sent to the server
 */
export const createUploadFormData = (selectedFiles: SelectedFileInfo[]): FormData => {
  console.log("Creating FormData from selectedFiles:", selectedFiles);
  
  if (selectedFiles.length === 0) {
    console.error("No files provided to createUploadFormData");
    throw new Error("No files selected for upload");
  }
  
  const importBody = createDraftImageImportBody(selectedFiles);
  console.log("Created importBody:", importBody);
  
  const formData = createFormDataFromImportBody(importBody);
  
  // Debug log FormData contents
  console.log("Created FormData with entries:");
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
    } else {
      console.log(`  ${key}: ${value}`);
    }
  }
  
  return formData;
};
