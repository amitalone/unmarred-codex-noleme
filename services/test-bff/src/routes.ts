import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

const LOCAL_IMAGE_FOLDER_BASE = "C:/workspace/face-swap-fs";

export async function routes(fastify: FastifyInstance, options: object): Promise<void> {
 


  fastify.get("/test/:pageNumber", async (
    request: FastifyRequest<{ Params: { pageNumber: string } }>,
    reply: FastifyReply
  ) => {
    const pageNumber = parseInt(request.params.pageNumber, 10) || 1;
    fastify.log.info(`GET /test/${pageNumber} endpoint was hit`);
    return {'message': `Test endpoint hit with page number: ${pageNumber}`};
  });


  
}

export default routes;