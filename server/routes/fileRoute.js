import express from "express";
import { auth } from "../middleware/Auth.js";
import * as fileController from "../controllers/fileController.js";

const router = express.Router();

router.post("/create", fileController.createFile);
/*router.delete("/delete", (req, res) => {
  console.log("!!! RAW ROUTE HIT !!!");
  console.log("Body received:", req.body);
  res.status(200).json({ message: "Echo from backend", data: req.body });
});*/
router.get("/", fileController.getFiles);
router.patch("/move", fileController.moveFile);
router.get("/:fileId",  fileController.getFile);
router.patch("/rename",  fileController.renameFileOrFolder);
router.patch("/:fileId",  fileController.updateFileCode);
router.delete("/delete", fileController.deleteFileorFolder);
// routes/fileRoutes.js
router.post("/snapshot/:fileId", auth, fileController.saveSnapshot);
// routes/fileRoutes.js


export default router;
