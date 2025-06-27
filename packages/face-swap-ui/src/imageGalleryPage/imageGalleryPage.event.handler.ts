import { FaceImage, ModelImage } from '@repo/shared-interfaces';

export const ButtonNames = {
  DELETE: "DELETE",
  BOOKMARK: "BOOKMARK",
  SELECT: "SELECT",
  RESULTS: "RESULTS",
}

// Create a type for the actions
export type SelectedImagesActions = {
  addFace: (face: FaceImage) => void;
  addModel: (model: ModelImage) => void;
  removeFace: (faceName: string) => void;
  removeModel: (modelName: string) => void;
  faces: FaceImage[];
  models: ModelImage[];
};

// Create a factory function instead of directly using hooks
export const createButtonActionHandler = (actions: SelectedImagesActions) => {
  return function(name: string, payload: any = null): void {
    const { faces, models, addFace, addModel, removeFace, removeModel } = actions;
    console.log(`${name} button clicked ${JSON.stringify(payload)}`);

    switch (name) {
      case ButtonNames.DELETE:
        // Handle delete action
        break;
      case ButtonNames.BOOKMARK:
        // Handle bookmark action
        break;
      case ButtonNames.SELECT:
        if(payload && payload.type === 'Face') {
          addFace(payload); 
        }
        if(payload && payload.type === 'Model') {
          addModel(payload);
        }
        console.log("Selected Faces:", faces);
        console.log("Selected Models:", models);
        break;
      case ButtonNames.RESULTS:
        // Handle results action
        break;
      default:
        break;
    }
  };
};
