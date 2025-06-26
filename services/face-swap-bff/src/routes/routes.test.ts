import { FastifyInstance } from 'fastify';
import { FACE_SWAP_BFF_ROUTES } from '@repo/shared-interfaces';
import FaceSwapBFFHelper from '@repo/service-utils/helpers/FaceSwapBFFHelper';
import { routes } from './routes.js';

// TypeScript type for jest
declare const jest: any;
declare const describe: any;
declare const beforeEach: any;
declare const it: any;
declare const expect: any;

// Mock the FaceSwapBFFHelper
jest.mock('@repo/service-utils/helpers/FaceSwapBFFHelper', () => ({
  getResultFacets: jest.fn(),
  getResultFacetsByPath: jest.fn(),
  getFaces: jest.fn(),
  getModels: jest.fn(),
}));

describe('Routes', () => {
  let fastify: FastifyInstance;
  const mockGet = jest.fn();
  const LOCAL_IMAGE_FOLDER_BASE = 'C:/workspace/face-swap-fs';

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create a mock fastify instance
    fastify = {
      get: mockGet,
    } as unknown as FastifyInstance;
  });

  it('should register the resultFacets route', async () => {
    // Arrange
    const mockResultFacets = { facets: ['facet1', 'facet2'] };
    (FaceSwapBFFHelper.getResultFacets as jest.Mock).mockResolvedValue(mockResultFacets);
    
    // Act
    await routes(fastify, {});
    
    // Get the handler function
    const routeHandler = mockGet.mock.calls.find(
      call => call[0] === FACE_SWAP_BFF_ROUTES.resultFacets
    )[1];
    
    const mockRequest = {};
    const mockReply = {};
    const result = await routeHandler(mockRequest, mockReply);
    
    // Assert
    expect(mockGet).toHaveBeenCalledWith(FACE_SWAP_BFF_ROUTES.resultFacets, expect.any(Function));
    expect(FaceSwapBFFHelper.getResultFacets).toHaveBeenCalledWith(`${LOCAL_IMAGE_FOLDER_BASE}/output`);
    expect(result).toEqual(mockResultFacets);
  });

  it('should register the resultFacetsByPath route', async () => {
    // Arrange
    const mockFacetsByPath = { results: ['result1', 'result2'] };
    (FaceSwapBFFHelper.getResultFacetsByPath as jest.Mock).mockResolvedValue(mockFacetsByPath);
    const path = 'folder-subfolder';
    const pageNumber = '1';
    
    // Act
    await routes(fastify, {});
    
    // Get the handler function
    const routeHandler = mockGet.mock.calls.find(
      call => call[0] === FACE_SWAP_BFF_ROUTES.resultFacetsByPath
    )[1];
    
    const mockRequest = {
      params: { path, pageNumber }
    };
    const mockReply = {};
    const result = await routeHandler(mockRequest, mockReply);
    
    // Assert
    expect(mockGet).toHaveBeenCalledWith(FACE_SWAP_BFF_ROUTES.resultFacetsByPath, expect.any(Function));
    expect(FaceSwapBFFHelper.getResultFacetsByPath).toHaveBeenCalledWith(
      LOCAL_IMAGE_FOLDER_BASE,
      '/output/folder/subfolder',
      pageNumber,
      25 // pageSize
    );
    expect(result).toEqual(mockFacetsByPath);
  });

  it('should register the faces route', async () => {
    // Arrange
    const mockFaces = { faces: ['face1', 'face2'] };
    (FaceSwapBFFHelper.getFaces as jest.Mock).mockResolvedValue(mockFaces);
    const pageNumber = '1';
    
    // Act
    await routes(fastify, {});
    
    // Get the handler function
    const routeHandler = mockGet.mock.calls.find(
      call => call[0] === FACE_SWAP_BFF_ROUTES.faces
    )[1];
    
    const mockRequest = {
      params: { pageNumber }
    };
    const mockReply = {};
    const result = await routeHandler(mockRequest, mockReply);
    
    // Assert
    expect(mockGet).toHaveBeenCalledWith(FACE_SWAP_BFF_ROUTES.faces, expect.any(Function));
    expect(FaceSwapBFFHelper.getFaces).toHaveBeenCalledWith(
      LOCAL_IMAGE_FOLDER_BASE,
      pageNumber,
      25 // pageSize
    );
    expect(result).toEqual(mockFaces);
  });

  it('should register the models route', async () => {
    // Arrange
    const mockModels = { models: ['model1', 'model2'] };
    (FaceSwapBFFHelper.getModels as jest.Mock).mockResolvedValue(mockModels);
    const pageNumber = '1';
    
    // Act
    await routes(fastify, {});
    
    // Get the handler function
    const routeHandler = mockGet.mock.calls.find(
      call => call[0] === FACE_SWAP_BFF_ROUTES.models
    )[1];
    
    const mockRequest = {
      params: { pageNumber }
    };
    const mockReply = {};
    const result = await routeHandler(mockRequest, mockReply);
    
    // Assert
    expect(mockGet).toHaveBeenCalledWith(FACE_SWAP_BFF_ROUTES.models, expect.any(Function));
    expect(FaceSwapBFFHelper.getModels).toHaveBeenCalledWith(
      LOCAL_IMAGE_FOLDER_BASE,
      pageNumber,
      25 // pageSize
    );
    expect(result).toEqual(mockModels);
  });
});
