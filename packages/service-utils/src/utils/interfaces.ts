export interface FileMetadata {
  size: number;
  created: Date;
  modified: Date;
  width?: number;
  height?: number;
  owner: string;
  ownerSocial?: string[];
  createdFmt: string;
}

export interface ImageSidecar {
  filename: string;
  type: string;
  metadata: FileMetadata;
  status: string;
  importType: string;
}

export interface FileToMove {
  name: string;
  type: string;
}

export interface MoveResult {
  filename: string;
  success: boolean;
  error: string | null;
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



export interface FilterOptions {
  filterType: string;
  filterValue: string;
}

export interface ImagesAndFiltersResult {
  page: number;
  pageSize: number;
  totalFiles: number;
  totalPages: number;
  files: ScannedFile[];
  damURL: string;
  facesPath: string;
  modelsPath: string;
}

export interface UploadedFile {
  filename: string;
  encoding?: string;
  mimetype?: string;
  fieldname?: string;
  toBuffer: () => Promise<Buffer>;
}