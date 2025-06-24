import { BaseImage } from "@repo/base-ui/types";


export interface FaceImage extends BaseImage {
  type: 'Face';
}
export interface ModelImage extends BaseImage {
  type: 'Model';
}
export interface OutputImage extends BaseImage {
  type: 'Output';
  face: FaceImage;
  model: ModelImage;
}