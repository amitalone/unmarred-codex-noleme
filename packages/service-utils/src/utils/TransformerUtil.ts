import { FolderStructure, ScannedFile, TreeViewItem } from "@repo/shared-interfaces";

export const getPaginatedFiles = (allFiles: ScannedFile[], pageNumber: number, pageSize: number): ScannedFile[] => {
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return allFiles.slice(startIndex, endIndex);
};

export const formatDateToCustomFormat = (date: Date): string => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear().toString().slice(-2);

  const daySuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return `${day}${daySuffix(day)}${month}${year}`;
};

export  function transformToTreeViewFormat(folderStructure: FolderStructure[], parentIdPrefix = ""): TreeViewItem[] {
  return folderStructure.map((folder) => {
    const sanitizedName = folder.name;

    // Generate a random 4-digit number
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const id = parentIdPrefix
      ? `${parentIdPrefix}-${sanitizedName}` // Append random digits to child IDs
      : `${sanitizedName}`; // Append random digits to root IDs

    const treeItem: TreeViewItem = {
      id: id,
      label: folder.name,
    };

    if (folder.children && folder.children.length > 0) {
      treeItem.children = transformToTreeViewFormat(folder.children, id);
    }

    return treeItem;
  });
}