export const FACE_SWAP_BFF_ROUTES ={
  resultFacets: "/results/facets",
  resultByFacetValue: "/results/facet/:path/:pageNumber",
  faces: "/faces/:pageNumber",
  models: "/models/:pageNumber",
  validateCombination: "/validate-combination",
  submitImages: "/submit-images",
}

export interface BaseImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  created?: string;
  createdfmt?: string;
  name: string;
}

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

export interface ScannedFile {
  name: string;
  path: string;
  created: Date;
}

export interface FolderStructure {
  name: string;
  children?: FolderStructure[];
}

export interface TreeViewItem {
  id: string;
  label: string;
  children?: TreeViewItem[];
}