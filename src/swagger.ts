import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import config from "./config";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Stock API",
      version: "1.0.0",
      description: "Stock information API",
    },
    servers: [
      { url: `http://localhost:${config.port}`, description: "Local Server" },
    ],
    components: {
      schemas: {
        StockCandle: {
          type: "object",
          properties: {
            date: { type: "string", example: "2025-04-22" },
            open: { type: "number", example: 150.25 },
            high: { type: "number", example: 152.75 },
            low: { type: "number", example: 149.1 },
            close: { type: "number", example: 151.3 },
            volume: { type: "integer", example: 1000000 },
          },
        },
      },
    },
  },
  apis: ["./routes/*.ts"],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
