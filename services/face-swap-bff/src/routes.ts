import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import FSUtil from "./FSUtil.js";
import outputRoutes from "./outputRoutes.js";
import { jest, describe, it, expect } from "@jest/globals";
import {
  FileParams,
  FileBody,
  ImportBody,
  AcceptFilesBody,
} from "./routes.interfaces.js";

const LOCAL_IMAGE_FOLDER_BASE = "C:/workspace/face-swap-fs";

async function routes(fastify: FastifyInstance, options: object): Promise<void> {
  fastify.register(import("@fastify/multipart"), {
    attachFieldsToBody: true,
    limits: { fileSize: 10 * 1024 * 1024 },
  });

  // Register the new route modules
  fastify.register(outputRoutes, { prefix: "/output" });

  fastify.post("/upload", async (
    request: FastifyRequest<{ Body: ImportBody }>,
    reply: FastifyReply
  ) => {
    fastify.log.info(`post /upload endpoint was hit`);

    const importType = request.body.importType?.[0]?.value || '';
    const files = request.body.files || [];
    const uploadedFiles = await FSUtil.processUploadedFiles(files, importType);
    return {
      success: true,
      message: "Files received " + importType,
      importType: importType,
      files: uploadedFiles,
    };
  });

  fastify.post("/image/delete", async (
    request: FastifyRequest<{ Body: FileBody }>,
    reply: FastifyReply
  ) => {
    fastify.log.info("POST /image/delete endpoint was hit " );
    
    const file = request.body?.file;
    if (!file) {
      return {
        success: false,
        message: "No file provided"
      };
    }

    const relativeImagePath = file?.relativePath;
    fastify.log.info("relativeImagePath ", relativeImagePath );
    console.log("Deleting file:", relativeImagePath);
    try {
     return FSUtil.deleteFile(relativeImagePath);
    } catch (error) {
      fastify.log.error(`Error deleting file: ${error}`);
      return {
        success: false,
        message: `Failed to delete file: ${(error as Error).message}`,
      };
    }
  });

  fastify.get("/models/:pageNumber", async (
    request: FastifyRequest<{ Params: FileParams }>,
    reply: FastifyReply
  ) => {
    const pageNumber = parseInt(request.params.pageNumber, 10) || 1;
    fastify.log.info(`GET /faces/${pageNumber} endpoint was hit`);
    const files = FSUtil.getImagesAndFilters(
      LOCAL_IMAGE_FOLDER_BASE,
      `model`,
      pageNumber,
      "model"
    );
    return files;
  });

  fastify.get("/faces/:pageNumber", async (
    request: FastifyRequest<{ Params: FileParams }>,
    reply: FastifyReply
  ) => {
    const pageNumber = parseInt(request.params.pageNumber, 10) || 1;
    fastify.log.info(`GET /faces/${pageNumber} endpoint was hit`);
    const files = FSUtil.getImagesAndFilters(
      LOCAL_IMAGE_FOLDER_BASE,
      `faces`,
      pageNumber,
      "face"
    );
    return files;
  });

  fastify.get("/imported-files/:pageNumber", async (
    request: FastifyRequest<{ Params: FileParams }>,
    reply: FastifyReply
  ) => {
    const pageNumber = parseInt(request.params.pageNumber, 10) || 1;
    fastify.log.info(`GET /imported-files/${pageNumber} endpoint was hit`);

    const files = FSUtil.getImagesAndFilters(
      LOCAL_IMAGE_FOLDER_BASE,
      `imported-files`,
      pageNumber,
      "imported-files"
    );
    return files;
  });
  
  fastify.post("/imported-files/accept", async (
    request: FastifyRequest<{ Body: AcceptFilesBody }>,
    reply: FastifyReply
  ) => {
    fastify.log.info("POST /imported-files/accept endpoint was hit");
    const files = request.body.files;
    const toBemoved = files.map((file) => {
      const parts = file.split(",");
      const name = parts[1] || '';
      const type = parts[0] || '';
      return { name: name.trim(), type: type.trim() };
    });
    await FSUtil.moveFiles(toBemoved);
    console.log("Accepted files:", toBemoved);
    return { success: true, acceptedFiles: toBemoved };
  });

  fastify.get("/submitJob", async (
    request: FastifyRequest<{ Params: FileParams }>,
    reply: FastifyReply
  ) => {
     const files = FSUtil.scanFolderRecursiveSimple
      (
      LOCAL_IMAGE_FOLDER_BASE,'output', "output")
      //return FSUtil.faceModelComboExists('face_igekiwqk.jpg', 'model_t1y634hu.jpg', files);
      //return files;
      return FSUtil.findCombination(['face_igekiwqk.jpg', 'face-005.jpg'], ['model_t1y634hu.jpg','model_sfhwi4rt.jpg', 'model-027.jpg'], files);
  });
  fastify.post("/validate-combination", async (request, reply) => {
      fastify.log.info("POST /submitJob endpoint was hit");
      const jobData = request.body;
  
      if (!jobData || Object.keys(jobData).length === 0) {
        reply.code(400); // Bad Request
        return { error: "Request body cannot be empty." };
      }
  
      fastify.log.info({ msg: "Received job data", data: jobData });
      const { faces, models } = jobData;
  
      if (!Array.isArray(faces) || faces.length === 0) {
        reply.code(400);
        return { error: "Invalid or empty 'faces' array in request body." };
      }
      if (!Array.isArray(models) || models.length === 0) {
        reply.code(400);
        return { error: "Invalid or empty 'models' array in request body." };
      }
  
      const files = FSUtil.scanFolderRecursiveSimple
      (
      LOCAL_IMAGE_FOLDER_BASE,'output', "output")
      const result = FSUtil.findCombination(faces, models, files);
      return result;
    });
  
}

export default routes;