import { BaseImage } from "@repo/shared-interfaces";

 
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
  
  /**
   * Callback function that is called when user scrolls to the top or bottom of the grid
   * @param direction 'up' or 'down' indicating the scroll direction
   */
  onScrollEnd?: (direction: 'up' | 'down') => void;
  
  /**
   * Flag to indicate if more images are being loaded
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * Callback function that is called when an image is clicked
   * @param index The index of the clicked image
   */
  onImageClick?: (index: number) => void;
}
