import React, { useState, type ReactNode } from "react";
import { FileDropZone } from "@repo/base-ui/fileDropZone";
import { RadioButtonGroup } from "./radioButtonGroup";
import { type ImportType } from "./importFaceModelPage.event.handler";

export interface FileUploadSectionProps {
  selectedImportType: ImportType | null;
  onImportTypeChange: (value: string) => void;
  radioOptions: Array<{ value: string; label: string }>;
  acceptDraftsButton?: ReactNode;
  uploadButton: ReactNode;
  onFilesChange?: (files: File[]) => void;
}

export function FileUploadSection({
  selectedImportType,
  onImportTypeChange,
  radioOptions,
  acceptDraftsButton,
  uploadButton,
  onFilesChange,
}: FileUploadSectionProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
      onFilesChange?.(fileArray);
      console.log("Files selected:", fileArray);
    }
  };

  return (
    <div className="file-upload-section">
      <div className="file-upload-section__content">
        <div className="file-upload-section__form">
          <h2 className="file-upload-section__heading">Select Import Type</h2>

          <RadioButtonGroup
            name="importType"
            options={radioOptions}
            selectedValue={selectedImportType}
            onChange={onImportTypeChange}
            className="file-upload-section__radio-group"
          />

          <div className="file-upload-section__drop-zone">
            <FileDropZone
              id="import-file-dropzone"
              name="importFiles"
              multiple={true}
              accept="image/*"
              title="Click to upload images"
              subtitle="or drag and drop"
              helperText="PNG, JPG, JPEG or GIF files"
              onChange={handleFileChange}
              className="file-upload-section__file-input"
            />
            {selectedFiles.length > 0 && (
              <div className="file-upload-section__file-list">
                <h4>Selected Files ({selectedFiles.length}):</h4>
                <ul>
                  {selectedFiles.map((file, index) => (
                    <li key={index} className="file-upload-section__file-item">
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="file-upload-section__actions">
            <div className="file-upload-section__button-group">
              {uploadButton}
            </div>
            {acceptDraftsButton && (
              <div className="file-upload-section__draft-actions">
                {acceptDraftsButton}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
