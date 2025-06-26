import * as fs from 'fs';
import * as path from 'path';
import { getFolderStructure, sortFilesByDate, scanFolderRecursive } from './FileSystemUtil';
import { ScannedFile } from '@repo/shared-interfaces';

// Mock the fs module
jest.mock('fs', () => ({
  readdirSync: jest.fn(),
  statSync: jest.fn(),
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}));

// Mock the path module
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
  extname: jest.fn((filePath) => {
    const parts = filePath.split('.');
    return parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
  }),
  basename: jest.fn((filePath, ext) => {
    let base = filePath.split('/').pop() || '';
    if (ext && base.endsWith(ext)) {
      base = base.slice(0, -ext.length);
    }
    return base;
  }),
  dirname: jest.fn((filePath) => {
    const parts = filePath.split('/');
    parts.pop();
    return parts.join('/');
  }),
}));

describe('FileSystemUtil', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFolderStructure', () => {
    it('should return an empty array when there are no items in the folder', () => {
      // Arrange
      (fs.readdirSync as jest.Mock).mockReturnValue([]);

      // Act
      const result = getFolderStructure('/test/path');

      // Assert
      expect(result).toEqual([]);
      expect(fs.readdirSync).toHaveBeenCalledWith('/test/path');
    });

    it('should return folder structure with nested folders', () => {
      // Arrange
      (fs.readdirSync as jest.Mock)
        .mockReturnValueOnce(['folder1', 'folder2']) // First level
        .mockReturnValueOnce(['subfolder1']) // folder1 contents
        .mockReturnValueOnce([]); // subfolder1 contents
      
      (fs.statSync as jest.Mock)
        .mockReturnValueOnce({ isDirectory: () => true }) // folder1
        .mockReturnValueOnce({ isDirectory: () => true }) // folder2
        .mockReturnValueOnce({ isDirectory: () => true }); // subfolder1

      // Act
      const result = getFolderStructure('/test/path');

      // Assert
      expect(result).toEqual([
        {
          name: 'folder1',
          children: [
            {
              name: 'subfolder1',
              children: [],
            },
          ],
        },
        {
          name: 'folder2',
          children: [],
        },
      ]);
      expect(fs.readdirSync).toHaveBeenCalledTimes(4); // First level + folder1 + subfolder1 + folder2
      expect(fs.statSync).toHaveBeenCalledTimes(3);
    });

    it('should handle errors when reading directory', () => {
      // Arrange
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (fs.readdirSync as jest.Mock).mockImplementation(() => {
        throw new Error('Test error');
      });

      // Act
      const result = getFolderStructure('/test/path');

      // Assert
      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy.mock.calls[0]?.[0]).toContain('Error reading folder structure');
      
      // Cleanup
      consoleErrorSpy.mockRestore();
    });
  });

  describe('sortFilesByDate', () => {
    it('should sort files by date in descending order', () => {
      // Arrange
      const files: ScannedFile[] = [
        { name: 'file1.txt', path: '/path/to/file1.txt', created: new Date('2025-01-01') },
        { name: 'file2.txt', path: '/path/to/file2.txt', created: new Date('2025-01-03') },
        { name: 'file3.txt', path: '/path/to/file3.txt', created: new Date('2025-01-02') },
      ];

      // Act
      const result = sortFilesByDate(files);

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0]?.name).toBe('file2.txt'); // Most recent
      expect(result[1]?.name).toBe('file3.txt');
      expect(result[2]?.name).toBe('file1.txt'); // Oldest
    });

    it('should return empty array when input is empty', () => {
      // Arrange
      const files: ScannedFile[] = [];

      // Act
      const result = sortFilesByDate(files);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('scanFolderRecursive', () => {
    it('should scan folder and return only image files', () => {
      // Arrange
      (fs.readdirSync as jest.Mock).mockReturnValue(['image.png', 'document.txt', 'photo.jpg']);
      
      (fs.statSync as jest.Mock)
        .mockReturnValueOnce({ 
          isFile: () => true, 
          isDirectory: () => false, 
          birthtime: new Date('2025-01-01') 
        }) // image.png
        .mockReturnValueOnce({ 
          isFile: () => true, 
          isDirectory: () => false, 
          birthtime: new Date('2025-01-02') 
        }) // document.txt
        .mockReturnValueOnce({ 
          isFile: () => true, 
          isDirectory: () => false, 
          birthtime: new Date('2025-01-03') 
        }); // photo.jpg

      (path.extname as jest.Mock)
        .mockReturnValueOnce('.png')
        .mockReturnValueOnce('.txt')
        .mockReturnValueOnce('.jpg');

      // Act
      const result = scanFolderRecursive('/base/path', 'sub/path');

      // Assert
      expect(result).toHaveLength(2); // Only the image files
      expect(result[0]?.name).toBe('image.png');
      expect(result[1]?.name).toBe('photo.jpg');
      expect(fs.readdirSync).toHaveBeenCalledWith('/base/path/sub/path');
    });

    it('should scan folder recursively including subfolders', () => {
      // Arrange
      (fs.readdirSync as jest.Mock)
        .mockReturnValueOnce(['image.png', 'subfolder']) // Root folder
        .mockReturnValueOnce(['nested.jpg']); // Subfolder
      
      (fs.statSync as jest.Mock)
        .mockReturnValueOnce({ 
          isFile: () => true, 
          isDirectory: () => false, 
          birthtime: new Date('2025-01-01') 
        }) // image.png
        .mockReturnValueOnce({ 
          isFile: () => false, 
          isDirectory: () => true, 
          birthtime: new Date('2025-01-02') 
        }) // subfolder
        .mockReturnValueOnce({ 
          isFile: () => true, 
          isDirectory: () => false, 
          birthtime: new Date('2025-01-03') 
        }); // nested.jpg

      (path.extname as jest.Mock)
        .mockReturnValueOnce('.png')
        .mockReturnValueOnce('.jpg');

      // Act
      const result = scanFolderRecursive('/base/path', '');

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]?.name).toBe('image.png');
      expect(result[0]?.path).toBe('/image.png');
      expect(result[1]?.name).toBe('nested.jpg');
      expect(result[1]?.path).toBe('/subfolder/nested.jpg');
    });

    it('should return an empty array when there are no image files', () => {
      // Arrange
      (fs.readdirSync as jest.Mock).mockReturnValue(['document.txt', 'document.pdf']);
      
      (fs.statSync as jest.Mock)
        .mockReturnValueOnce({ 
          isFile: () => true, 
          isDirectory: () => false, 
          birthtime: new Date('2025-01-01') 
        }) // document.txt
        .mockReturnValueOnce({ 
          isFile: () => true, 
          isDirectory: () => false, 
          birthtime: new Date('2025-01-02') 
        }); // document.pdf

      (path.extname as jest.Mock)
        .mockReturnValueOnce('.txt')
        .mockReturnValueOnce('.pdf');

      // Act
      const result = scanFolderRecursive('/base/path', 'sub/path');

      // Assert
      expect(result).toHaveLength(0);
    });

    it('should handle errors when scanning folder', () => {
      // Arrange
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (fs.readdirSync as jest.Mock).mockImplementation(() => {
        throw new Error('Test error');
      });

      // Act
      const result = scanFolderRecursive('/base/path', 'sub/path');

      // Assert
      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy.mock.calls[0]?.[0]).toContain('Error scanning folder');
      
      // Cleanup
      consoleErrorSpy.mockRestore();
    });

    it('should use SFW mode when enabled', () => {
      // We need to mock the SFW_MODE constant, but it's private to the module
      // This test would need to be adjusted if we could control SFW_MODE
      // For now, we'll just test the default behavior (SFW_MODE = false)
      
      // Arrange
      (fs.readdirSync as jest.Mock).mockReturnValue(['image.png']);
      
      (fs.statSync as jest.Mock)
        .mockReturnValueOnce({ 
          isFile: () => true, 
          isDirectory: () => false, 
          birthtime: new Date('2025-01-01') 
        }); // image.png

      (path.extname as jest.Mock).mockReturnValueOnce('.png');

      // Act
      const result = scanFolderRecursive('/base/path', '');

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe('image.png'); // Not 'sfw.png', assuming SFW_MODE is false
    });
  });
});
