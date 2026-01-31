import rateLimit from "express-rate-limit";

export const executionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,             // max 10 executions
  message: {
    message: "Too many executions. Please wait a minute."
  },
  standardHeaders: true,
  legacyHeaders: false
});
