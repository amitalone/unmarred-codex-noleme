export interface FileParams {
  pageNumber: string;
}

export interface FileBody {
  file: Array<{
    relativeImagePath: string;
    imageType: string;
  }>;
}

export interface ImportBody {
  importType: Array<{ value: string }>;
  files: any[];
}

export interface AcceptFilesBody {
  files: string[];
}