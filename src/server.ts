import { createApp } from "./app";
import config from "./config";
import mongoose from "mongoose";

const startServer = async () => {
  try {
    const app = await createApp();
    const server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });

    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${config.port} is already in use`);
      }
      process.exit(1);
    });
    const shutdown = async (signal: string) => {
      console.log(`${signal} received. Shutting down server...`);
      const forceExit = setTimeout(() => {
        console.error("Forcing shutdown after timeout");
        process.exit(1);
      }, 5000);

      try {
        await new Promise<void>((resolve) => {
          server.close(() => resolve());
        });
        console.log("Server closed");

        await mongoose.connection.close();
        console.log("MongoDB connection closed");

        clearTimeout(forceExit);
        process.exit(0);
      } catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
      }
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
    });

    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      shutdown("uncaughtException");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
