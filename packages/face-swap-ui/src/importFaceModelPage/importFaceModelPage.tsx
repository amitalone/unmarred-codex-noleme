import React, { useState, type ReactNode } from "react";
import { FixedHeightContainer } from "@repo/base-ui/fixedHeightContainer";
import { FaceSwapAppPage } from "../faceSwapAppPage";
import { ImportFaceModelPageActionButtons } from "./importFaceModelPageActionButtons";
import { RadioButtonGroup } from "./radioButtonGroup";
import { FileUploadSection } from "./fileUploadSection";
import { ImageDisplaySection } from "./imageDisplaySection";
import { BaseImage } from "@repo/shared-interfaces";
import { useDraftImageSelection } from "../hooks/useDraftImageSelection";
import {
  type ImportType,
  type ImportFaceModelPageActions,
} from "./importFaceModelPage.event.handler";

export interface ImportFaceModelPageProps {
  images: BaseImage[];
  title?: string;
  className?: string;
  children?: ReactNode;
  actions: ImportFaceModelPageActions;
}

export function ImportFaceModelPage({
  images,
  title = "Import Face or Model",
  className = "",
  children,
  actions,
}: ImportFaceModelPageProps) {
  const [selectedImportType, setSelectedImportType] =
    useState<ImportType | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Use the draft image selection hook
  const {
    imagesWithSelection,
    handleImageSelectionChange,
    getSelectedImageNames,
    getSelectedDraftImages,
    selectedCount,
  } = useDraftImageSelection(images);

  const radioOptions = [
    { value: "face", label: "Face" },
    { value: "model", label: "Model" },
  ];

  const handleRadioChange = (value: string) => {
    setSelectedImportType(value as ImportType);
  };

  const handleFilesChange = (files: File[]) => {
    setSelectedFiles(files);
  };

  // Get the action buttons from our component
  const { AcceptDraftsButton, UploadButton } = ImportFaceModelPageActionButtons(
    {
      actions,
      importType: selectedImportType,
      selectedFiles,
      disabled: !selectedImportType,
      selectedDraftCount: selectedCount,
      getSelectedImageNames,
      getSelectedDraftImages,
    }
  );

  return (
    <FaceSwapAppPage title={title} className={className}>
      <FixedHeightContainer height="85vh">
        <div className="import-face-model-page">
          <div className="import-face-model-page__two-column-layout">
            {/* Left Column - File Upload Section */}
            <div className="import-face-model-page__upload-column">
              {" "}
              <FileUploadSection
                selectedImportType={selectedImportType}
                onImportTypeChange={handleRadioChange}
                radioOptions={radioOptions}
                acceptDraftsButton={AcceptDraftsButton}
                uploadButton={UploadButton}
                onFilesChange={handleFilesChange}
              />
            </div>

            {/* Right Column - Image Grid Section */}
            <div className="import-face-model-page__images-column">
              <ImageDisplaySection
                images={imagesWithSelection}
                onImageSelectionChange={handleImageSelectionChange}
              />
            </div>
          </div>

          {/* Render additional content */}
          {children && (
            <div className="import-face-model-page__additional-content">
              {children}
            </div>
          )}
        </div>
      </FixedHeightContainer>
    </FaceSwapAppPage>
  );
}
