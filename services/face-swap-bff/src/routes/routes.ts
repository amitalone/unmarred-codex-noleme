import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {DraftImageImportBody, FACE_SWAP_BFF_ROUTES, AcceptDraftImagesRequest} from "@repo/shared-interfaces";
import FaceSwapBFFHelper from "@repo/service-utils/helpers/FaceSwapBFFHelper";
const LOCAL_IMAGE_FOLDER_BASE = "C:/workspace/face-swap-fs";

const pageSize = 25;

export async function routes(fastify: FastifyInstance, options: object): Promise<void> {
  

    fastify.get(FACE_SWAP_BFF_ROUTES.resultFacets, async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    return FaceSwapBFFHelper.getResultFacets(LOCAL_IMAGE_FOLDER_BASE + "/output");
  });

   fastify.get(FACE_SWAP_BFF_ROUTES.resultByFacetValue, async (
    request: FastifyRequest<{ Params: { path: string; pageNumber: string } }>,
    reply: FastifyReply
  ) => {
    const { path, pageNumber } = request.params;
    const folderPath = path.replaceAll("-", "/");
    return FaceSwapBFFHelper.getResultByFacetValue(LOCAL_IMAGE_FOLDER_BASE, `/output/${folderPath}`, parseInt(pageNumber), pageSize );
  });

  fastify.get(FACE_SWAP_BFF_ROUTES.faces, async (
    request: FastifyRequest<{ Params: { pageNumber: string } }>,
    reply: FastifyReply
  ) => {
    const { pageNumber } = request.params;
    return FaceSwapBFFHelper.getFaces(LOCAL_IMAGE_FOLDER_BASE, parseInt(pageNumber), pageSize);
  });

  fastify.get(FACE_SWAP_BFF_ROUTES.models, async (
    request: FastifyRequest<{ Params: { pageNumber: string } }>,
    reply: FastifyReply
  ) => {
    const { pageNumber } = request.params;
    return FaceSwapBFFHelper.getModels(LOCAL_IMAGE_FOLDER_BASE, parseInt(pageNumber), pageSize);
  });

  fastify.post(FACE_SWAP_BFF_ROUTES.validateCombination, async (
    request: FastifyRequest<{ Body: { faces: string[]; models: string[] } }>,
    reply: FastifyReply
  ) => {
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
    return FaceSwapBFFHelper.checkExistingFaceModelCombination(faces, models);
  });

  fastify.post(FACE_SWAP_BFF_ROUTES.submitImages, async (
    request: FastifyRequest<{ Body: { faces: string[]; models: string[] } }>,
    reply: FastifyReply
  ) => {
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
    return FaceSwapBFFHelper.checkExistingFaceModelCombination(faces, models);
  });

  fastify.post(FACE_SWAP_BFF_ROUTES.uploadToDraft, async (
    request: FastifyRequest<{ Body: any }>,
    reply: FastifyReply
  ) => {
    fastify.log.info(`post /uploadToDraft endpoint was hit`);
    
    // Debug: Log keys to avoid circular reference
    const body = request.body as any;
    fastify.log.info("Request body keys:", Object.keys(body));
    
    // Extract importType from the structure: importType[0][value]
    let importType = '';
    
    if (body['importType[0][value]']) {
      const importTypeField = body['importType[0][value]'];
      importType = typeof importTypeField === 'string' ? importTypeField : 
                   (importTypeField.value || importTypeField);
    }
    
    fastify.log.info("Extracted importType:", importType);
    const files = body.files || [];
    
    if (!importType) {
      reply.code(400);
      return { error: "Import type is required." };
    }
    
    if (!files || files.length === 0) {
      reply.code(400);
      return { error: "At least one file is required." };
    }
    
    try {
      const uploadedFiles = await FaceSwapBFFHelper.addDraftFiles(files, importType);
      return {
        success: true,
        message: `Successfully uploaded ${uploadedFiles.length} files as ${importType}`,
        importType: importType,
        files: uploadedFiles,
      };
    } catch (error) {
      fastify.log.error("Error processing uploaded files:", error);
      reply.code(500);
      return { error: "Internal server error while processing files." };
    }
  });

   fastify.post(FACE_SWAP_BFF_ROUTES.acceptDraftImages, async (
    request: FastifyRequest<{ Body: AcceptDraftImagesRequest }>,
    reply: FastifyReply
  ) => {
    fastify.log.info(`post /accept-draft endpoint was hit`);
    
    try {
      const body = request.body;
      
      // Validate request body
      if (!body || !body.images || !Array.isArray(body.images)) {
        reply.code(400);
        return { 
          error: "Invalid request body. Expected 'images' array of DraftImage objects.",
          acceptedImages: [],
          errors: [],
          totalProcessed: 0
        };
      }
      
      if (body.images.length === 0) {
        reply.code(400);
        return { 
          error: "No images provided to accept.",
          acceptedImages: [],
          errors: [],
          totalProcessed: 0
        };
      }
      
      fastify.log.info(`Processing ${body.images.length} draft images`);
      
      // Process the draft images
      const result = await FaceSwapBFFHelper.acceptDraftImages(body.images);
      
      // Return success response even if some images failed
      const statusCode = result.errors.length > 0 ? 207 : 200; // 207 Multi-Status for partial success
      reply.code(statusCode);
      
      return {
        success: true,
        message: `Processed ${result.totalProcessed} images. ${result.acceptedImages.length} accepted, ${result.errors.length} failed.`,
        ...result
      };
      
    } catch (error) {
      fastify.log.error("Error processing draft images:", error);
      reply.code(500);
      return { 
        error: "Internal server error while processing draft images.",
        acceptedImages: [],
        errors: [(error as Error).message],
        totalProcessed: 0
      };
    }
  } );

   fastify.get(FACE_SWAP_BFF_ROUTES.draftImages, async (
    request: FastifyRequest<{ Params: { pageNumber: string } }>,
    reply: FastifyReply
  ) => {
    const { pageNumber } = request.params;
    return FaceSwapBFFHelper.getDraftImages(LOCAL_IMAGE_FOLDER_BASE, parseInt(pageNumber) || 1, pageSize); 
  });
}


 
 
export default routes;