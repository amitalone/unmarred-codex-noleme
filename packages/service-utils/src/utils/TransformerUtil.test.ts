import { formatDateToCustomFormat, getPaginatedFiles, transformToTreeViewFormat } from './TransformerUtil';
import { FolderStructure, ScannedFile, TreeViewItem } from "@repo/shared-interfaces";

describe('TransformerUtil', () => {
  describe('getPaginatedFiles', () => {
    it('should return the correct slice of files for the first page', () => {
      // Arrange
      const allFiles: ScannedFile[] = [
        { name: 'file1.txt', path: '/path/to/file1.txt', created: new Date('2025-01-01') },
        { name: 'file2.txt', path: '/path/to/file2.txt', created: new Date('2025-01-02') },
        { name: 'file3.txt', path: '/path/to/file3.txt', created: new Date('2025-01-03') },
        { name: 'file4.txt', path: '/path/to/file4.txt', created: new Date('2025-01-04') },
        { name: 'file5.txt', path: '/path/to/file5.txt', created: new Date('2025-01-05') },
      ];
      const pageNumber = 1;
      const pageSize = 2;

      // Act
      const result = getPaginatedFiles(allFiles, pageNumber, pageSize);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]?.name).toBe('file1.txt');
      expect(result[1]?.name).toBe('file2.txt');
    });

    it('should return the correct slice of files for a middle page', () => {
      // Arrange
      const allFiles: ScannedFile[] = [
        { name: 'file1.txt', path: '/path/to/file1.txt', created: new Date('2025-01-01') },
        { name: 'file2.txt', path: '/path/to/file2.txt', created: new Date('2025-01-02') },
        { name: 'file3.txt', path: '/path/to/file3.txt', created: new Date('2025-01-03') },
        { name: 'file4.txt', path: '/path/to/file4.txt', created: new Date('2025-01-04') },
        { name: 'file5.txt', path: '/path/to/file5.txt', created: new Date('2025-01-05') },
      ];
      const pageNumber = 2;
      const pageSize = 2;

      // Act
      const result = getPaginatedFiles(allFiles, pageNumber, pageSize);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]?.name).toBe('file3.txt');
      expect(result[1]?.name).toBe('file4.txt');
    });

    it('should return a partial page when there are not enough items', () => {
      // Arrange
      const allFiles: ScannedFile[] = [
        { name: 'file1.txt', path: '/path/to/file1.txt', created: new Date('2025-01-01') },
        { name: 'file2.txt', path: '/path/to/file2.txt', created: new Date('2025-01-02') },
        { name: 'file3.txt', path: '/path/to/file3.txt', created: new Date('2025-01-03') },
      ];
      const pageNumber = 2;
      const pageSize = 2;

      // Act
      const result = getPaginatedFiles(allFiles, pageNumber, pageSize);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe('file3.txt');
    });

    it('should return an empty array when page number is too high', () => {
      // Arrange
      const allFiles: ScannedFile[] = [
        { name: 'file1.txt', path: '/path/to/file1.txt', created: new Date('2025-01-01') },
        { name: 'file2.txt', path: '/path/to/file2.txt', created: new Date('2025-01-02') },
      ];
      const pageNumber = 3;
      const pageSize = 1;

      // Act
      const result = getPaginatedFiles(allFiles, pageNumber, pageSize);

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe('formatDateToCustomFormat', () => {
    it('should format a date with st suffix', () => {
      // Arrange
      const date = new Date(2025, 0, 1); // Jan 1, 2025

      // Act
      const result = formatDateToCustomFormat(date);

      // Assert
      expect(result).toBe('1stJan25');
    });

    it('should format a date with nd suffix', () => {
      // Arrange
      const date = new Date(2025, 0, 2); // Jan 2, 2025

      // Act
      const result = formatDateToCustomFormat(date);

      // Assert
      expect(result).toBe('2ndJan25');
    });

    it('should format a date with rd suffix', () => {
      // Arrange
      const date = new Date(2025, 0, 3); // Jan 3, 2025

      // Act
      const result = formatDateToCustomFormat(date);

      // Assert
      expect(result).toBe('3rdJan25');
    });

    it('should format a date with th suffix for days 4-20', () => {
      // Arrange
      const date = new Date(2025, 0, 14); // Jan 14, 2025

      // Act
      const result = formatDateToCustomFormat(date);

      // Assert
      expect(result).toBe('14thJan25');
    });

    it('should format a date with th suffix for days ending in 0', () => {
      // Arrange
      const date = new Date(2025, 0, 20); // Jan 20, 2025

      // Act
      const result = formatDateToCustomFormat(date);

      // Assert
      expect(result).toBe('20thJan25');
    });

    it('should format a date with st suffix for 21', () => {
      // Arrange
      const date = new Date(2025, 0, 21); // Jan 21, 2025

      // Act
      const result = formatDateToCustomFormat(date);

      // Assert
      expect(result).toBe('21stJan25');
    });

    it('should format a date with different month', () => {
      // Arrange
      const date = new Date(2025, 11, 25); // Dec 25, 2025

      // Act
      const result = formatDateToCustomFormat(date);

      // Assert
      expect(result).toBe('25thDec25');
    });
  });

  describe('transformToTreeViewFormat', () => {
    it('should transform a simple folder structure to tree view format', () => {
      // Arrange
      const folderStructure: FolderStructure[] = [
        {
          name: 'root',
          children: []
        }
      ];

      // Act
      const result = transformToTreeViewFormat(folderStructure);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('root');
      expect(result[0]?.label).toBe('root');
      expect(result[0]?.children).toBeUndefined();
    });

    it('should transform a nested folder structure to tree view format', () => {
      // Arrange
      const folderStructure: FolderStructure[] = [
        {
          name: 'root',
          children: [
            {
              name: 'folder1',
              children: []
            },
            {
              name: 'folder2',
              children: [
                {
                  name: 'subfolder',
                  children: []
                }
              ]
            }
          ]
        }
      ];

      // Act
      const result = transformToTreeViewFormat(folderStructure);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('root');
      expect(result[0]?.label).toBe('root');
      expect(result[0]?.children).toHaveLength(2);
      expect(result[0]?.children?.[0]?.id).toBe('root-folder1');
      expect(result[0]?.children?.[0]?.label).toBe('folder1');
      expect(result[0]?.children?.[1]?.id).toBe('root-folder2');
      expect(result[0]?.children?.[1]?.label).toBe('folder2');
      expect(result[0]?.children?.[1]?.children).toHaveLength(1);
      expect(result[0]?.children?.[1]?.children?.[0]?.id).toBe('root-folder2-subfolder');
      expect(result[0]?.children?.[1]?.children?.[0]?.label).toBe('subfolder');
    });

    it('should transform multiple root folders to tree view format', () => {
      // Arrange
      const folderStructure: FolderStructure[] = [
        {
          name: 'root1',
          children: []
        },
        {
          name: 'root2',
          children: []
        }
      ];

      // Act
      const result = transformToTreeViewFormat(folderStructure);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]?.id).toBe('root1');
      expect(result[0]?.label).toBe('root1');
      expect(result[1]?.id).toBe('root2');
      expect(result[1]?.label).toBe('root2');
    });

    it('should transform a structure with a custom parent prefix', () => {
      // Arrange
      const folderStructure: FolderStructure[] = [
        {
          name: 'folder',
          children: []
        }
      ];
      const parentPrefix = 'custom-prefix';

      // Act
      const result = transformToTreeViewFormat(folderStructure, parentPrefix);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('custom-prefix-folder');
      expect(result[0]?.label).toBe('folder');
    });

    // Note: We can't test the random number generation part directly,
    // as it would make the test non-deterministic. The test would be flaky.
    // In a real-world scenario, we might want to mock Math.random or
    // refactor the function to accept a random number generator.
  });
});
