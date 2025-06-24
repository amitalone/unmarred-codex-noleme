import { FastifyInstance } from "fastify";
import outputRoutes from "./outputRoutes.js";
import { jest, describe, it, expect } from "@jest/globals";
import '@testing-library/jest-dom';

const mockFSUtil = {
  getImagesAndFilters: jest.fn().mockReturnValue({ files: [] }),
  getFolderStructure: jest.fn().mockReturnValue({ folders: [] }),
  transformToTreeViewFormat: jest.fn().mockReturnValue([])
};

jest.mock("./FSUtil.js", () => ({
  default: mockFSUtil
}));

describe("outputRoutes", () => {
  let fastify: FastifyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    fastify = {
      register: jest.fn(),
      get: jest.fn(),
      log: {
        info: jest.fn(),
        error: jest.fn()
      }
    } as unknown as FastifyInstance;
  });

  describe("GET /:pageNumber", () => {
    it("should exist", async () => {
      await outputRoutes(fastify, {});
      expect(fastify.get).toHaveBeenCalledWith(
        "/:pageNumber",
        expect.any(Function)
      );
    });
  });

  describe("GET /facets", () => {
    it("should exist", async () => {
      await outputRoutes(fastify, {});
      expect(fastify.get).toHaveBeenCalledWith(
        "/facets",
        expect.any(Function)
      );
    });
  });

  describe("GET /faceted/:path/:pageNumber", () => {
    it("should exist", async () => {
      await outputRoutes(fastify, {});
      expect(fastify.get).toHaveBeenCalledWith(
        "/faceted/:path/:pageNumber",
        expect.any(Function)
      );
    });
  });

  describe("GET /faceted/:path/:imageType/:imageName/:pageNumber", () => {
    it("should exist", async () => {
      await outputRoutes(fastify, {});
      expect(fastify.get).toHaveBeenCalledWith(
        "/faceted/:path/:imageType/:imageName/:pageNumber",
        expect.any(Function)
      );
    });
  });
});
