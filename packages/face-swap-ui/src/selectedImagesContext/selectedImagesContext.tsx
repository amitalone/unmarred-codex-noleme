import React, { createContext, useContext, useState, ReactNode } from "react";
import { FaceImage, ModelImage } from "@repo/shared-interfaces";

interface SelectedImagesContextType {
  faces: FaceImage[];
  models: ModelImage[];
  addFace: (face: FaceImage) => void;
  addModel: (model: ModelImage) => void;
  removeFace: (faceName: string) => void;
  removeModel: (modelName: string) => void;
}

const SelectedImagesContext = createContext<
  SelectedImagesContextType | undefined
>(undefined);

interface SelectedImagesProviderProps {
  children: ReactNode;
}

export const SelectedImagesProvider: React.FC<SelectedImagesProviderProps> = ({
  children,
}) => {
  const [faces, setFaces] = useState<FaceImage[]>([]);
  const [models, setModels] = useState<ModelImage[]>([]);

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

  return (
    <SelectedImagesContext.Provider
      value={{
        faces,
        models,
        addFace,
        addModel,
        removeFace,
        removeModel,
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
