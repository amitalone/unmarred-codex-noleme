import { getResultByFacetValue, getResultFacets, getFaces, getModels } from '../helpers/FaceSwapBFFHelper';
import * as FileSystemUtil from '../utils/FileSystemUtil';
import * as TransformerUtil from '../utils/TransformerUtil';
import { FaceImage, ModelImage, OutputImage, ScannedFile } from '@repo/shared-interfaces';

// Mock the FileSystemUtil and TransformerUtil modules
jest.mock('../utils/FileSystemUtil', () => ({
  scanFolderRecursive: jest.fn(),
  sortFilesByDate: jest.fn(),
  getFolderStructure: jest.fn(),
}));

jest.mock('../utils/TransformerUtil', () => ({
  getPaginatedFiles: jest.fn(),
  formatDateToCustomFormat: jest.fn(),
  transformToTreeViewFormat: jest.fn(),
}));

// Constants used in the FaceSwapBFFHelper
const DAM_URL = "http://192.168.50.38:8000/";
const RELATIVE_FACES_PATH = "faces/";
const RELATIVE_MODEL_PATH = "model/";

describe('FaceSwapBFFHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getResultByFacetValue', () => {
    it('should call scanFolderRecursive and return result images', async () => {
      // Arrange
      const basePath = '/base/path';
      const path = 'results/path';
      const pageNumber = 1;
      const pageSize = 10;
      const mockDate = new Date('2023-01-01');
      const mockFiles: ScannedFile[] = [
        { name: 'face1--model1.jpg', path: 'path/to/face1--model1.jpg', created: mockDate }
      ];

      // Expected result structure
      const expectedResult = [{
        src: `${DAM_URL}${RELATIVE_FACES_PATH}face1--model1.jpg`,
        alt: 'Output Image',
        created: mockDate.toISOString(),
        createdfmt: 'formatted-date',
        name: 'face1--model1.jpg',
        type: 'Output',
        face: {
          src: `${DAM_URL}${RELATIVE_FACES_PATH}face1`,
          alt: 'Face Image',
          name: 'face1',
          type: 'Face'
        },
        model: {
          src: `${DAM_URL}${RELATIVE_MODEL_PATH}model1.jpg`,
          alt: 'Model Image',
          name: 'model1.jpg',
          type: 'Model'
        }
      }];

      // Setup mocks
      (FileSystemUtil.scanFolderRecursive as jest.Mock).mockResolvedValue(mockFiles);
      (FileSystemUtil.sortFilesByDate as jest.Mock).mockReturnValue(mockFiles);
      (TransformerUtil.getPaginatedFiles as jest.Mock).mockReturnValue(mockFiles);
      (TransformerUtil.formatDateToCustomFormat as jest.Mock).mockReturnValue('formatted-date');

      // Act
      const result = await getResultByFacetValue(basePath, path, pageNumber, pageSize);

      // Assert
      expect(FileSystemUtil.scanFolderRecursive).toHaveBeenCalledWith(basePath, path);
      expect(FileSystemUtil.sortFilesByDate).toHaveBeenCalled();
      expect(TransformerUtil.getPaginatedFiles).toHaveBeenCalledWith(mockFiles, pageNumber, pageSize);
      expect(result).toEqual(expectedResult);
    });

    it('should return empty array when no files are found', async () => {
      // Arrange
      const basePath = '/base/path';
      const path = 'results/path';
      const pageNumber = 1;
      const pageSize = 10;
      const mockFiles: ScannedFile[] = [];

      // Setup mocks
      (FileSystemUtil.scanFolderRecursive as jest.Mock).mockResolvedValue(mockFiles);
      (FileSystemUtil.sortFilesByDate as jest.Mock).mockReturnValue(mockFiles);
      (TransformerUtil.getPaginatedFiles as jest.Mock).mockReturnValue(mockFiles);

      // Act
      const result = await getResultByFacetValue(basePath, path, pageNumber, pageSize);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getResultFacets', () => {
    it('should call getFolderStructure and transformToTreeViewFormat', () => {
      // Arrange
      const path = '/results/path';
      const mockFolderStructure = [{ name: 'folder1', children: [] }];
      const mockTreeViewResult = [{ id: 'folder1', label: 'folder1' }];

      (FileSystemUtil.getFolderStructure as jest.Mock).mockReturnValue(mockFolderStructure);
      (TransformerUtil.transformToTreeViewFormat as jest.Mock).mockReturnValue(mockTreeViewResult);

      // Act
      const result = getResultFacets(path);

      // Assert
      expect(FileSystemUtil.getFolderStructure).toHaveBeenCalledWith(path);
      expect(TransformerUtil.transformToTreeViewFormat).toHaveBeenCalledWith(mockFolderStructure);
      expect(result).toEqual(mockTreeViewResult);
    });
  });

  describe('getFaces', () => {
    it('should call scanFolderRecursive with the correct path and return face images', async () => {
      // Arrange
      const basePath = '/base/path';
      const pageNumber = 1;
      const pageSize = 10;
      const mockDate = new Date('2023-01-01');
      const mockFiles: ScannedFile[] = [
        { name: 'face1.jpg', path: 'faces/face1.jpg', created: mockDate }
      ];
      const expectedResults: FaceImage[] = [
        {
          src: `${DAM_URL}${RELATIVE_FACES_PATH}face1.jpg`,
          alt: 'Face Image',
          created: mockDate.toISOString(),
          createdfmt: 'formatted-date',
          name: 'face1.jpg',
          type: 'Face'
        }
      ];

      (FileSystemUtil.scanFolderRecursive as jest.Mock).mockResolvedValue(mockFiles);
      (FileSystemUtil.sortFilesByDate as jest.Mock).mockReturnValue(mockFiles);
      (TransformerUtil.getPaginatedFiles as jest.Mock).mockReturnValue(mockFiles);
      (TransformerUtil.formatDateToCustomFormat as jest.Mock).mockReturnValue('formatted-date');

      // Act
      const result = await getFaces(basePath, pageNumber, pageSize);

      // Assert
      expect(FileSystemUtil.scanFolderRecursive).toHaveBeenCalledWith(basePath, RELATIVE_FACES_PATH);
      expect(result).toEqual(expectedResults);
    });

    it('should return empty array when no files are found', async () => {
      // Arrange
      const basePath = '/base/path';
      const pageNumber = 1;
      const pageSize = 10;
      const mockFiles: ScannedFile[] = [];

      (FileSystemUtil.scanFolderRecursive as jest.Mock).mockResolvedValue(mockFiles);
      (FileSystemUtil.sortFilesByDate as jest.Mock).mockReturnValue(mockFiles);
      (TransformerUtil.getPaginatedFiles as jest.Mock).mockReturnValue(mockFiles);

      // Act
      const result = await getFaces(basePath, pageNumber, pageSize);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getModels', () => {
    it('should call scanFolderRecursive with the correct path and return model images', async () => {
      // Arrange
      const basePath = '/base/path';
      const pageNumber = 1;
      const pageSize = 10;
      const mockDate = new Date('2023-01-01');
      const mockFiles: ScannedFile[] = [
        { name: 'model1.jpg', path: 'model/model1.jpg', created: mockDate }
      ];
      const expectedResults: ModelImage[] = [
        {
          src: `${DAM_URL}${RELATIVE_MODEL_PATH}model1.jpg`,
          alt: 'Model Image',
          created: mockDate.toISOString(),
          createdfmt: 'formatted-date',
          name: 'model1.jpg',
          type: 'Model'
        }
      ];

      (FileSystemUtil.scanFolderRecursive as jest.Mock).mockResolvedValue(mockFiles);
      (FileSystemUtil.sortFilesByDate as jest.Mock).mockReturnValue(mockFiles);
      (TransformerUtil.getPaginatedFiles as jest.Mock).mockReturnValue(mockFiles);
      (TransformerUtil.formatDateToCustomFormat as jest.Mock).mockReturnValue('formatted-date');

      // Act
      const result = await getModels(basePath, pageNumber, pageSize);

      // Assert
      expect(FileSystemUtil.scanFolderRecursive).toHaveBeenCalledWith(basePath, RELATIVE_MODEL_PATH);
      expect(result).toEqual(expectedResults);
    });

    it('should return empty array when no files are found', async () => {
      // Arrange
      const basePath = '/base/path';
      const pageNumber = 1;
      const pageSize = 10;
      const mockFiles: ScannedFile[] = [];

      (FileSystemUtil.scanFolderRecursive as jest.Mock).mockResolvedValue(mockFiles);
      (FileSystemUtil.sortFilesByDate as jest.Mock).mockReturnValue(mockFiles);
      (TransformerUtil.getPaginatedFiles as jest.Mock).mockReturnValue(mockFiles);

      // Act
      const result = await getModels(basePath, pageNumber, pageSize);

      // Assert
      expect(result).toEqual([]);
    });
  });
});
