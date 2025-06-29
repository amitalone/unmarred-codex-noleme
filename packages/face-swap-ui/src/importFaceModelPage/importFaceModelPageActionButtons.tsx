import React from "react";
import { Button } from "@repo/design-system/button";
import {
  ButtonNames,
  createImportFaceModelPageHandler,
  type ImportFaceModelPageActions,
  type ImportType,
} from "./importFaceModelPage.event.handler";

export interface ImportFaceModelPageActionButtonsProps {
  actions: ImportFaceModelPageActions;
  importType: ImportType | null;
  selectedFiles?: File[];
  disabled?: boolean;
}

export function ImportFaceModelPageActionButtons({
  actions,
  importType,
  selectedFiles = [],
  disabled = false,
}: ImportFaceModelPageActionButtonsProps) {
  const buttonHandler = createImportFaceModelPageHandler(actions);

  const handleAcceptClick = () => {
    if (importType) {
      buttonHandler(ButtonNames.ACCEPT, importType, selectedFiles);
    }
  };

  const handleUploadClick = () => {
    if (importType) {
      buttonHandler(ButtonNames.UPLOAD, importType, selectedFiles);
    }
  };

  const AcceptButton = (
    <Button
      key="accept"
      text="Accept"
      onClick={handleAcceptClick}
      className={`import-face-model-page__accept-button ${disabled ? "import-face-model-page__accept-button--disabled" : ""}`}
      data-testid="accept-button"
    />
  );

  const UploadButton = (
    <Button
      key="upload"
      text="Upload"
      onClick={handleUploadClick}
      disabled={disabled || selectedFiles.length === 0}
      className={`import-face-model-page__upload-button ${disabled || selectedFiles.length === 0 ? "import-face-model-page__upload-button--disabled" : ""}`}
      data-testid="upload-button"
    />
  );

  return {
    AcceptButton,
    UploadButton,
  };
}
