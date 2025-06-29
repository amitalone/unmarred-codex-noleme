import Fastify, { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";

export interface BFFServerProps {
  name: string;
  prefix: string;
  port: number;
  host?: string;
  origin?: string;
  routes: () => Promise<void>;
}
const fastify: FastifyInstance = Fastify({
  logger: {
    level: "info", 
    transport:
      process.env.NODE_ENV !== "production"
        ? {
            target: "pino-pretty",
            options: {
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname",
            },
          }
        : undefined,
  },
});

const initializeServer = async (origin: string, prefix:string, routes: () => Promise<void>) => {
  await fastify.register(fastifyCors, {
  origin: origin,
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
});
fastify.register(import("@fastify/multipart"), {
    attachFieldsToBody: true,
    limits: { fileSize: 10 * 1024 * 1024 },
  });
 fastify.register(routes, { prefix: prefix }); 
  
}

export const start = async ({name, prefix= "/api/", origin='*', routes, port, host='0.0.0.0'}: BFFServerProps) => {
  await initializeServer(origin, prefix, routes);
    console.log(`Starting BFF Server: ${name}`);
    await fastify.listen({ port, host });
    console.log(`Starting BFF Server: ${name} at http://${host}:${port}${prefix}`);
}
