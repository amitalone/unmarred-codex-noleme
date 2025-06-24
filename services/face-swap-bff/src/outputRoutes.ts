import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import FSUtil from "./FSUtil.js";

import { FileParams, FacetedParams, FilteredParams } from "./outputRoutes.interfaces.js";

const LOCAL_IMAGE_FOLDER_BASE = "C:/workspace/face-swap-fs";

async function outputRoutes(fastify: FastifyInstance, options: object): Promise<void> {
  fastify.get("/:pageNumber", async (
    request: FastifyRequest<{ Params: FileParams }>,
    reply: FastifyReply
  ) => {
    const pageNumber = parseInt(request.params.pageNumber, 10) || 1;
    fastify.log.info(`GET /output/${pageNumber} endpoint was hit`);
    return FSUtil.getImagesAndFilters(
      LOCAL_IMAGE_FOLDER_BASE,
      "output",
      pageNumber,
      "output"
    );
  });

  fastify.get("/facets", async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    fastify.log.info(`GET /output/facets endpoint was hit`); // Corrected log
    const facets = FSUtil.getFolderStructure(
      LOCAL_IMAGE_FOLDER_BASE + "/output"
    );
    return FSUtil.transformToTreeViewFormat(facets);
  });

  fastify.get("/faceted/:path/:pageNumber", async (
    request: FastifyRequest<{ Params: FacetedParams }>,
    reply: FastifyReply
  ) => {
    const { path } = request.params;
    const pageNumber = parseInt(request.params.pageNumber, 10) || 1;
    fastify.log.info(`GET /output/faceted/${path}/${pageNumber} endpoint was hit`); // Corrected log
    const folderPath = path.replaceAll("-", "/");
    return FSUtil.getImagesAndFilters(
      LOCAL_IMAGE_FOLDER_BASE,
      `/output/${folderPath}`,
      pageNumber,
      "output"
    );
  });

  fastify.get("/faceted/:path/:imageType/:imageName/:pageNumber", async (
    request: FastifyRequest<{ Params: FilteredParams }>,
    reply: FastifyReply
  ) => {
    const { path, imageType, imageName } = request.params;
    const pageNumber = parseInt(request.params.pageNumber, 10) || 1;
    fastify.log.info(`GET /output/faceted/${path}/${imageType}/${imageName}/${pageNumber} endpoint was hit`); // Corrected log
    const folderPath = path.replaceAll("-", "/");
    const filter = { filterType: imageType, filterValue: imageName };
    return FSUtil.getImagesAndFilters(
      LOCAL_IMAGE_FOLDER_BASE, `/output/${folderPath}`, pageNumber, "output", filter);
  });
}

export default outputRoutes;