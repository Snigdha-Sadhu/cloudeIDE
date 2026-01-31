import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  downloadProject,
  moveFolder,
  renameProject
} from "../controllers/projectController.js";
import {auth} from '../middleware/Auth.js';
const router = express.Router();

router.post("/create",auth,createProject);
router.get("/",auth,getProjects);
router.get("/:id",auth,getProjectById);
router.put("/:id", auth,updateProject);
router.delete("/:id", auth,deleteProject);
router.get("/:projectId/download", auth,downloadProject);

router.patch("/rename/:projectId",auth,renameProject);
router.patch("/:projectId/movefolder",moveFolder);
export default router;
