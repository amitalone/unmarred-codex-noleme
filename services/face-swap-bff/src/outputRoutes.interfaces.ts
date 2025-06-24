interface FileParams {
  pageNumber: string;
}

interface FacetedParams extends FileParams {
  path: string;
}

interface FilteredParams extends FacetedParams {
  imageType: string;
  imageName: string;
}

export type { FileParams, FacetedParams, FilteredParams };