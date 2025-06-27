"use client";
import { type ReactNode, useState } from "react";
import { Drawer } from "@repo/design-system/drawer";
import { IconButton } from "@repo/base-ui/iconButton";
import { IconImages } from "@repo/design-system/icons";
import {
  FaceImage as FaceImageType,
  ModelImage as ModelImageType,
} from "@repo/shared-interfaces";
import { FaceImage, ModelImage } from "@repo/base-ui/imageButton";

interface SelectedMaceModelContainerProps {
  className?: string;
  selectedFaces?: FaceImageType[];
  selectedModels?: ModelImageType[];
  position?: "left" | "right";
  title?: string;
  onClearSelection?: () => void;
}

export function SelectedMaceModelContainer({
  className = "",
  selectedFaces = [],
  selectedModels = [],
  position = "right",
  title = "Selected Images",
  onClearSelection,
}: SelectedMaceModelContainerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
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
                      <FaceImage src={face.src} alt={face.alt || face.name} />
                      {/* <div className="selected-mace-model-container__image-name">
                        {face.name}
                      </div> */}
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
                      <ModelImage
                        src={model.src}
                        alt={model.alt || model.name}
                      />
                      {/* <div className="selected-mace-model-container__image-name">
                        {model.name}
                      </div> */}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {hasSelectedItems && onClearSelection && (
            <div className="selected-mace-model-container__actions">
              <button
                className="selected-mace-model-container__clear-button"
                onClick={onClearSelection}
                data-testid="selected-mace-model-clear-button"
              >
                Clear Selection
              </button>
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
