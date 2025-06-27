import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {FACE_SWAP_BFF_ROUTES} from "@repo/shared-interfaces";
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
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { path, pageNumber } = request.params;
    const folderPath = path.replaceAll("-", "/");
    return FaceSwapBFFHelper.getResultByFacetValue(LOCAL_IMAGE_FOLDER_BASE, `/output/${folderPath}`, pageNumber, pageSize );
  });

  fastify.get(FACE_SWAP_BFF_ROUTES.faces, async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { pageNumber } = request.params;
    return FaceSwapBFFHelper.getFaces(LOCAL_IMAGE_FOLDER_BASE, pageNumber, pageSize);
  });

  fastify.get(FACE_SWAP_BFF_ROUTES.models, async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { pageNumber } = request.params;
    return FaceSwapBFFHelper.getModels(LOCAL_IMAGE_FOLDER_BASE, pageNumber, pageSize);
  });

  fastify.post(FACE_SWAP_BFF_ROUTES.validateCombination, async (
    request: FastifyRequest,
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
    request: FastifyRequest,
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
  
}
 
 
export default routes;