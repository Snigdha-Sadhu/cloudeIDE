import express from "express";
import { runCode } from "../controllers/executeController.js";
import { auth } from "../middleware/Auth.js";
import { executionLimiter } from "../middleware/executionLimiter.js";
const router = express.Router();

// POST /api/execute
router.post("/run",executionLimiter,runCode);

export default router;
