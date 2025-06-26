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

   fastify.get(FACE_SWAP_BFF_ROUTES.resultFacetsByPath, async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { path, pageNumber } = request.params;
    const folderPath = path.replaceAll("-", "/");
    return FaceSwapBFFHelper.getResultFacetsByPath(LOCAL_IMAGE_FOLDER_BASE, `/output/${folderPath}`, pageNumber, pageSize );
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
}

export default routes;