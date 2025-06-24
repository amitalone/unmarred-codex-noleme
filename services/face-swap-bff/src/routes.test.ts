import { FastifyInstance } from "fastify";
import routes from "./routes.js";
import { jest, describe, it, expect } from "@jest/globals";

const mockFSUtil = {
  processUploadedFiles: jest.fn().mockResolvedValue(["processed1", "processed2"]),
  deleteFile: jest.fn().mockResolvedValue({ success: true, error: null }),
  getImagesAndFilters: jest.fn().mockReturnValue({ files: [] }),
  moveFiles: jest.fn().mockResolvedValue([])
};

jest.mock("./FSUtil.js", () => ({
  default: mockFSUtil
}));

describe("routes", () => {
  let fastify: FastifyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    fastify = {
      register: jest.fn(),
      post: jest.fn(),
      get: jest.fn(),
      log: {
        info: jest.fn(),
        error: jest.fn()
      }
    } as unknown as FastifyInstance;
  });

  it("should register all routes", async () => {
    await routes(fastify, {});
    expect(fastify.register).toHaveBeenCalledTimes(2);
    expect(fastify.post).toHaveBeenCalledTimes(3);
    expect(fastify.get).toHaveBeenCalledTimes(3);
  });

  describe("POST /upload", () => {
    it("should exist", async () => {
      await routes(fastify, {});
      expect(fastify.post).toHaveBeenCalledWith(
        "/upload",
        expect.any(Function)
      );
    });
  });

  describe("POST /image/delete", () => {
    it("should exist", async () => {
      await routes(fastify, {});
      expect(fastify.post).toHaveBeenCalledWith(
        "/image/delete",
        expect.any(Function)
      );
    });
  });

  describe("GET /models/:pageNumber", () => {
    it("should exist", async () => {
      await routes(fastify, {});
      expect(fastify.get).toHaveBeenCalledWith(
        "/models/:pageNumber",
        expect.any(Function)
      );
    });
  });

  describe("GET /faces/:pageNumber", () => {
    it("should exist", async () => {
      await routes(fastify, {});
      expect(fastify.get).toHaveBeenCalledWith(
        "/faces/:pageNumber",
        expect.any(Function)
      );
    });
  });

  describe("GET /imported-files/:pageNumber", () => {
    it("should exist", async () => {
      await routes(fastify, {});
      expect(fastify.get).toHaveBeenCalledWith(
        "/imported-files/:pageNumber",
        expect.any(Function)
      );
    });
  });

  describe("POST /imported-files/accept", () => {
    it("should exist", async () => {
      await routes(fastify, {});
      expect(fastify.post).toHaveBeenCalledWith(
        "/imported-files/accept",
        expect.any(Function)
      );
    });
  });
});
