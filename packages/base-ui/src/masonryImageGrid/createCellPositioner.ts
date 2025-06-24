interface CellPositionerParams {
  columnCount: number;
  columnWidth: number;
  spacer?: number;
}

/**
 * Creates a positioning function that places items in a masonry grid layout
 * Items are placed in the column with the shortest height
 */
export function createCellPositioner({
  columnCount,
  columnWidth,
  spacer = 0,
}: CellPositionerParams) {  // Track the height of each column
  const columnHeights: number[] = Array(columnCount).fill(0);
  
  /**
   * Cell positioner function
   * @param index The index of the item
   * @param height The height of the item
   * @returns The position {left, top} where the item should be placed
   */
  function cellPositioner(index: number, height: number) {
    // Find the shortest column to place the item
    let columnIndex = 0;
    for (let i = 1; i < columnHeights.length; i++) {
      if ((columnHeights[i] ?? 0) < (columnHeights[columnIndex] ?? 0)) {
        columnIndex = i;
      }
    }
    
    // Calculate the left position based on the column
    const left = columnIndex * (columnWidth + spacer);
    
    // Get the current top position (height) of the column
    const top = columnHeights[columnIndex] || 0;
    
    // Update the column height
    columnHeights[columnIndex] = top + height + spacer;
    
    return {
      left,
      top,
    };
  }
  
  /**
   * Reset the positioner with new parameters
   */
  cellPositioner.reset = (params: CellPositionerParams) => {
    columnCount = params.columnCount;
    columnWidth = params.columnWidth;
    spacer = params.spacer ?? 0;
    
    // Reset column heights
    for (let i = 0; i < columnCount; i++) {
      columnHeights[i] = 0;
    }
  };
  
  return cellPositioner;
}
