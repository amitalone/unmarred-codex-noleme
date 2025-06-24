export interface BaseImage {
  imageSrc: string;
  alt?: string;
  width?: number;
  height?: number;
  type: string;
}

export interface MasonryImageGridProps {
  /**
   * List of image objects to display in the grid
   */
  images: BaseImage[];
  
  /**
   * Width of each column in pixels
   * @default 200
   */
  columnWidth?: number;
  
  /**
   * Number of columns to display
   * If not provided, it will be calculated based on the container width
   */
  columnCount?: number;
  
  /**
   * Horizontal gap between columns in pixels
   * @default 10
   */
  columnGap?: number;
  
  /**
   * Vertical gap between rows in pixels
   * @default 10
   */
  rowGap?: number;
  
  /**
   * Additional CSS class name
   */
  className?: string;
  /**
   * Optional list of action buttons to render in the ImageActionBar
   * If not provided, the default delete button will be rendered
   */
  actionButtonList?: React.ReactNode[];
}
