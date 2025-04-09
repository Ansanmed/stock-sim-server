import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 60, // Máximo 60 solicitudes por minuto
  message: "Too many requests, please try again later.",
});
