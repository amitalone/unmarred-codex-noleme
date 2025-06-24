import { start } from "./server.js";

async function main(): Promise<void> {
  console.log("Application is starting..."); // Simple console log before server starts logging
  await start(); // Start the Fastify server
  // The server's logger (configured in server.js) will indicate when it's listening.
}

main().catch((err: Error) => {
  console.error("Failed to start the application:", err);
  process.exit(1);
});