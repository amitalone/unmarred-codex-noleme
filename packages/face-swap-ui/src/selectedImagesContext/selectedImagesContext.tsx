import React, { createContext, useContext, useState, ReactNode } from "react";
import { FaceImage, ModelImage } from "@repo/shared-interfaces";

interface SelectedImagesContextType {
  faces: FaceImage[];
  models: ModelImage[];
  addFace: (face: FaceImage) => void;
  addModel: (model: ModelImage) => void;
  removeFace: (faceName: string) => void;
  removeModel: (modelName: string) => void;
  uploadSelection: () => Promise<void>;
  isUploading: boolean;
  uploadError: string | null;
  clearAll: () => void;
}

const SelectedImagesContext = createContext<
  SelectedImagesContextType | undefined
>(undefined);

interface SelectedImagesProviderProps {
  children: ReactNode;
  onUpload?: (faces: string[], models: string[]) => Promise<any>;
}

export const SelectedImagesProvider: React.FC<SelectedImagesProviderProps> = ({
  children,
  onUpload,
}) => {
  const [faces, setFaces] = useState<FaceImage[]>([]);
  const [models, setModels] = useState<ModelImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const addFace = (face: FaceImage) => {
    setFaces((prevFaces) => {
      // Check if face already exists by name
      if (prevFaces.some((f) => f.name === face.name)) {
        return prevFaces;
      }
      return [...prevFaces, face];
    });
  };

  const addModel = (model: ModelImage) => {
    setModels((prevModels) => {
      // Check if model already exists by name
      if (prevModels.some((m) => m.name === model.name)) {
        return prevModels;
      }
      return [...prevModels, model];
    });
  };

  const removeFace = (faceName: string) => {
    setFaces((prevFaces) => prevFaces.filter((face) => face.name !== faceName));
  };

  const removeModel = (modelName: string) => {
    setModels((prevModels) =>
      prevModels.filter((model) => model.name !== modelName)
    );
  };

  const clearAll = () => {
    setFaces([]);
    setModels([]);
    setUploadError(null);
  };

  const uploadSelection = async () => {
    if (!onUpload) {
      throw new Error("Upload function not provided");
    }

    if (faces.length === 0 || models.length === 0) {
      setUploadError("Please select at least one face and one model");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const faceNames = faces.map((face) => face.name);
      const modelNames = models.map((model) => model.name);

      await onUpload(faceNames, modelNames);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SelectedImagesContext.Provider
      value={{
        faces,
        models,
        addFace,
        addModel,
        removeFace,
        removeModel,
        uploadSelection,
        isUploading,
        uploadError,
        clearAll,
      }}
    >
      {children}
    </SelectedImagesContext.Provider>
  );
};

export const useSelectedImages = (): SelectedImagesContextType => {
  const context = useContext(SelectedImagesContext);

  if (context === undefined) {
    throw new Error(
      "useSelectedImages must be used within a SelectedImagesProvider"
    );
  }

  return context;
};
