"use client";
import { type ReactNode, useState } from "react";
import { Drawer } from "@repo/design-system/drawer";
import { IconButton } from "@repo/base-ui/iconButton";
import { IconImages, IconUpload, IconClose } from "@repo/design-system/icons";
import {
  FaceImage as FaceImageType,
  ModelImage as ModelImageType,
} from "@repo/shared-interfaces";
import { FaceImage, ModelImage } from "@repo/base-ui/imageButton";
import { useSelectedImages } from "../selectedImagesContext";

interface SelectedMaceModelContainerProps {
  className?: string;
  position?: "left" | "right";
  title?: string;
}

export function SelectedMaceModelContainer({
  className = "",
  position = "right",
  title = "Selected Images",
}: SelectedMaceModelContainerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Use the context instead of props
  const {
    faces: selectedFaces,
    models: selectedModels,
    removeFace,
    removeModel,
    clearAll,
    uploadSelection,
    isUploading,
    uploadError,
  } = useSelectedImages();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleUpload = async () => {
    try {
      await uploadSelection();
      // You might want to show a success message here
      console.log("Upload successful!");
    } catch (error) {
      // Error is already handled in the context
      console.error("Upload failed:", error);
    }
  };

  const hasSelectedItems =
    selectedFaces.length > 0 || selectedModels.length > 0;

  return (
    <>
      <div
        className={`selected-mace-model-container__toggle-button ${hasSelectedItems ? "selected-mace-model-container__button--has-items" : ""}`}
        data-testid="selected-mace-model-toggle-button"
      >
        <IconButton
          reactIcon={IconImages}
          onClick={toggleDrawer}
          textColor="white"
          shadowClass="shadow-md"
          size={40}
          data-testid="selected-mace-model-toggle-icon"
          payload={
            hasSelectedItems
              ? { faces: selectedFaces.length, models: selectedModels.length }
              : undefined
          }
        />
        {hasSelectedItems && (
          <div className="selected-mace-model-container__badge-container">
            {selectedFaces.length > 0 && (
              <span className="selected-mace-model-container__badge selected-mace-model-container__badge--faces">
                {selectedFaces.length}
              </span>
            )}
            {selectedModels.length > 0 && (
              <span className="selected-mace-model-container__badge selected-mace-model-container__badge--models">
                {selectedModels.length}
              </span>
            )}
          </div>
        )}
      </div>

      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        position={position}
        title={title}
        className={`selected-mace-model-container__drawer ${className}`}
        data-testid="selected-mace-model-container-drawer"
      >
        <div className="selected-mace-model-container__content">
          {/* Show upload error if any */}
          {uploadError && (
            <div
              className="selected-mace-model-container__error"
              style={{
                color: "red",
                padding: "0.5rem",
                marginBottom: "1rem",
                backgroundColor: "#fee",
                borderRadius: "0.25rem",
              }}
            >
              {uploadError}
            </div>
          )}
          <div className="selected-mace-model-container__columns-layout">
            {selectedFaces.length > 0 && (
              <div className="selected-mace-model-container__column">
                <h6 className="selected-mace-model-container__section-title">
                  Face Images ({selectedFaces.length})
                </h6>
                <div className="selected-mace-model-container__image-grid">
                  {selectedFaces.map((face) => (
                    <div
                      key={face.name}
                      className="selected-mace-model-container__image-item"
                      data-testid="selected-face-image-item"
                    >
                      <div className="selected-mace-model-container__image-wrapper">
                        <FaceImage src={face.src} alt={face.alt || face.name} />
                        <button
                          className="selected-mace-model-container__remove-button"
                          onClick={() => removeFace(face.name)}
                          data-testid={`remove-face-button-${face.name}`}
                          aria-label={`Remove ${face.name}`}
                        >
                          <IconClose size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedModels.length > 0 && (
              <div className="selected-mace-model-container__column">
                <h3 className="selected-mace-model-container__section-title">
                  Model Images ({selectedModels.length})
                </h3>
                <div className="selected-mace-model-container__image-grid">
                  {selectedModels.map((model) => (
                    <div
                      key={model.name}
                      className="selected-mace-model-container__image-item"
                      data-testid="selected-model-image-item"
                    >
                      <div className="selected-mace-model-container__image-wrapper">
                        <ModelImage
                          src={model.src}
                          alt={model.alt || model.name}
                        />
                        <button
                          className="selected-mace-model-container__remove-button"
                          onClick={() => removeModel(model.name)}
                          data-testid={`remove-model-button-${model.name}`}
                          aria-label={`Remove ${model.name}`}
                        >
                          <IconClose size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>{" "}
          {hasSelectedItems && (
            <div className="selected-mace-model-container__actions">
              <button
                className="selected-mace-model-container__clear-button"
                onClick={clearAll}
                data-testid="selected-mace-model-clear-button"
              >
                Clear Selection
              </button>

              <IconButton
                reactIcon={IconUpload}
                onClick={isUploading ? () => {} : handleUpload}
                textColor="primary"
                shadowClass="shadow-md"
                size={40}
                data-testid="selected-mace-model-upload-button"
              />
            </div>
          )}
          {!hasSelectedItems && (
            <div className="selected-mace-model-container__empty-state">
              <p>No images selected.</p>
              <p>Select face and model images to see them here.</p>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}
