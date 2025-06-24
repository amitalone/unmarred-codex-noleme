import Fastify, { FastifyInstance } from "fastify";
import jobRoutes from "./routes.js";
import fastifyCors from "@fastify/cors";

const fastify: FastifyInstance = Fastify({
  logger: {
    level: "info", // Standard levels: 'fatal', 'error', 'warn', 'info', 'debug', 'trace'
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

// Register the CORS plugin
await fastify.register(fastifyCors, {
  origin: "*", // Allow all origins
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  // allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'], // Add any custom header
});

// Register your routes
// It's good practice to prefix API routes, e.g., /api/v1
fastify.register(jobRoutes, { prefix: "/api/" }); // All routes in jobRoutes will be prefixed

const start = async (): Promise<void> => {
  try {
    const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 4001;
    const host: string = process.env.HOST || "0.0.0.0"; // Listen on all available network interfaces
    await fastify.listen({ port, host });
    // The logger will automatically output the listening address if configured correctly.
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Export the start function and optionally the fastify instance if needed elsewhere (e.g., for testing)
export { start, fastify };