export const ButtonNames = {
  ACCEPT: "ACCEPT",
  UPLOAD: "UPLOAD",
} as const;

export type ImportType = "face" | "model";

export interface SelectedFileInfo {
  file: File;
  importType: ImportType;
}

export type ImportFaceModelPageActions = {
  onAccept: (importType: ImportType) => void;
  onUpload: (selectedFiles: SelectedFileInfo[]) => Promise<void>;
};

export const createImportFaceModelPageHandler = (actions: ImportFaceModelPageActions) => {
  return function(name: string, importType: ImportType, selectedFiles?: File[]): void {
    const { onAccept, onUpload } = actions;
    console.log(`${name} button clicked with import type: ${importType}`);
    
    switch (name) {
      case ButtonNames.ACCEPT:
        onAccept(importType);
        break;
      case ButtonNames.UPLOAD:
        if (selectedFiles && selectedFiles.length > 0) {
          const fileInfos: SelectedFileInfo[] = selectedFiles.map(file => ({
            file,
            importType
          }));
          onUpload(fileInfos).catch((error: any) => {
            console.error('Error uploading files:', error);
          });
        }
        break;
      default:
        break;
    }
  };
};
