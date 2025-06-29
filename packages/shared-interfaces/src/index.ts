export const FACE_SWAP_BFF_ROUTES ={
  resultFacets: "/results/facets",
  resultByFacetValue: "/results/facet/:path/:pageNumber",
  faces: "/faces/:pageNumber",
  models: "/models/:pageNumber",
  validateCombination: "/validate-combination",
  submitImages: "/submit-images",
  uploadToDraft: "/upload-to-draft",
  acceptDraftImages: "/accept-draft",
  draftImages: "/draft-images/:pageNumber",
}

export interface BaseImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  created?: string;
  createdfmt?: string;
  name: string;
  status?: string;
}

type ImageType = 'Face' | 'Model' | 'Output' | 'Draft';
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

export interface DraftImage extends BaseImage {
  type: 'Draft';
  image:FaceImage | ModelImage;
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

export interface DraftImageImportBody {
  importType: Array<{ value: string }>;
  files: any[];
}

