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
  selectedDraftCount?: number;
  getSelectedImageNames?: () => string[];
  getSelectedDraftImages?: () => import("@repo/shared-interfaces").DraftImage[];
}

export function ImportFaceModelPageActionButtons({
  actions,
  importType,
  selectedFiles = [],
  disabled = false,
  selectedDraftCount = 0,
  getSelectedImageNames,
  getSelectedDraftImages,
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

  const handleAcceptDraftsClick = async () => {
    console.log("handleAcceptDraftsClick called");
    console.log("getSelectedDraftImages:", getSelectedDraftImages);
    console.log("actions.acceptDraftImages:", actions.acceptDraftImages);

    if (getSelectedDraftImages && actions.acceptDraftImages) {
      const selectedDraftImages = getSelectedDraftImages();
      console.log(
        "Selected draft images from getSelectedDraftImages:",
        selectedDraftImages
      );
      await actions.acceptDraftImages(selectedDraftImages);
    } else {
      console.log(
        "Missing dependencies - getSelectedDraftImages:",
        !!getSelectedDraftImages,
        "actions.acceptDraftImages:",
        !!actions.acceptDraftImages
      );
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

  const AcceptDraftsButton = (
    <Button
      key="accept-drafts"
      text={`Accept ${selectedDraftCount > 0 ? `(${selectedDraftCount})` : ""} Draft Images`}
      onClick={handleAcceptDraftsClick}
      disabled={selectedDraftCount === 0}
      className={`import-face-model-page__accept-drafts-button ${
        selectedDraftCount > 0
          ? "import-face-model-page__accept-drafts-button--active"
          : ""
      }`}
      data-testid="accept-drafts-button"
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
    AcceptDraftsButton,
    UploadButton,
  };
}
