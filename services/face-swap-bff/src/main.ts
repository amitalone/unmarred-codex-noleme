import { start } from "./server.js";


async function main(): Promise<void> {
  console.log("Application is starting...."); 
  await start();
  
}

main().catch((err: Error) => {
  console.error("Failed to start the application:", err);
  process.exit(1);
});