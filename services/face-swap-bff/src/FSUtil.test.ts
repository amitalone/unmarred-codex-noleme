import fs from "fs";
import path from "path";
import sharp from "sharp";
import os from "os";
import FSUtil from "./FSUtil.js";
import { jest, describe, it, expect } from "@jest/globals";
import { UploadedFile } from "./interfaces.js";

// Mock modules
jest.mock("fs");
jest.mock("os", () => ({
  userInfo: jest.fn().mockReturnValue({ username: "amita" }),
  hostname: jest.fn().mockReturnValue("firelight846"),
}));

jest.mock("sharp", () => {
  return function () {
    return {
      metadata: () => Promise.resolve({ width: 100, height: 200 }),
    };
  };
});

const mockFs = fs as jest.Mocked<typeof fs>;

describe("FSUtil", () => {
  describe("deleteFile", () => {
    it("should delete a file and its JSON sidecar", async () => {
      jest.spyOn(mockFs.promises, "unlink").mockResolvedValue();
      jest.spyOn(mockFs, "existsSync").mockReturnValue(true);

      const result = await FSUtil.deleteFile("test.jpg", "image");

      expect(mockFs.promises.unlink).toHaveBeenCalledWith(
        path.join("C:/workspace/face-swap-fs/", "test.jpg")
      );
      expect(result.success).toBe(true);
    });

    it("should return an error if file deletion fails", async () => {
      jest.spyOn(mockFs.promises, "unlink").mockRejectedValue(new Error("Delete error"));

      const result = await FSUtil.deleteFile("test.jpg", "image");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Delete error");
    });
  });

  describe("moveFiles", () => {
    it("should move files to the correct folder", async () => {
      jest.spyOn(mockFs.promises, "rename").mockResolvedValue();
      jest.spyOn(mockFs, "existsSync").mockReturnValue(false);
      jest.spyOn(mockFs, "mkdirSync").mockImplementation(() => undefined);

      const fileList = [{ name: "test.jpg", type: "faces" }];
      const result = await FSUtil.moveFiles(fileList);

      expect(result[0]?.success).toBe(true);
    });

    it("should handle errors during file move", async () => {
      jest.spyOn(mockFs.promises, "rename").mockRejectedValue(new Error("Move error"));

      const fileList = [{ name: "test.jpg", type: "faces" }];
      const result = await FSUtil.moveFiles(fileList);

      expect(result[0]?.success).toBe(false);
      expect(result[0]?.error).toBe("Move error");
    });
  });

  describe("getFileMetadata", () => {
    // it("should return file metadata", async () => {
    //   const mockStats = {
    //     size: 1234,
    //     birthtime: new Date("2023-01-01"),
    //     mtime: new Date("2023-01-02"),
    //   } as fs.Stats;

    //   mockFs.statSync = jest.fn().mockReturnValue(mockStats);

    //   // Reset mock before test
    //   (sharp as jest.Mock).mockReset();
    //   (sharp as jest.Mock).mockImplementation(() => ({
    //     metadata: () => Promise.resolve({ width: 100, height: 200 }),
    //   }));

    //   const metadata = await FSUtil.getFileMetadata("test.jpg");

    //   expect(metadata).toEqual({
    //     size: 1234,
    //     created: new Date("2023-01-01"),
    //     modified: new Date("2023-01-02"),
    //     width: 100,
    //     height: 200,
    //     owner: "amita",
    //     computer: "firelight846",
    //   });
    // });

    // it("should handle errors gracefully", async () => {
    //   mockFs.statSync = jest.fn().mockImplementation(() => {
    //     throw new Error("Stat error");
    //   });

    //   const metadata = await FSUtil.getFileMetadata("test.jpg");

    //   expect(metadata).toEqual({
    //     size: 0,
    //     created: expect.any(Date),
    //     modified: expect.any(Date),
    //     owner: "amita",
    //     computer: "firelight846",
    //   });
    // });
  });

  describe("processUploadedFiles", () => {
    it("should process and save uploaded files", async () => {
      jest.spyOn(mockFs.promises, "writeFile").mockResolvedValue();
      jest.spyOn(mockFs, "mkdirSync").mockImplementation(() => undefined);

      const files = [
        {
          filename: "test.jpg",
          toBuffer: () => Promise.resolve(Buffer.from("")),
        },
      ] as UploadedFile[];

      const result = await FSUtil.processUploadedFiles(files, "faces");

      expect(result).toContain("test.jpg");
    });
  });
});