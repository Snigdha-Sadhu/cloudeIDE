import { executeCode } from "../services/pistonServices.js";
import Execution from "../models/executionmodel.js";
import File from "../models/filemodel.js";

export const runCode = async (req, res, next) => {
  try {
    console.log(req.body);
    
    const userId = req.user?.id || null;
    const { fileId, code, stdin = "" ,userFileName =""} = req.body;
console.log("filename",userFileName);
    if (!fileId || !code) throw { statusCode: 400, message: "fileId and code are required" };

    // Load file and project info
    const file = await File.findById(fileId).populate("projectId");
    if (!file) throw { statusCode: 404, message: "File not found" };

    // Optional authorization
    if (userId && file.projectId && file.projectId.userId.toString() !== userId) {
      throw { statusCode: 403, message: "Unauthorized" };
    }

    // Update file code
    file.code = code;
    await file.save();

    // Execute
    const result = await executeCode(file.language, code, stdin,userFileName);

    // Upsert execution with projectId
    const execution = await Execution.findOneAndUpdate(
      { userId, fileId }, // unique filter
      {
        projectId: file.projectId?._id || null,
        language: file.language,
        code,
        stdin,
        stdout: result.stdout || "",
        stderr: result.stderr || "",
        status: result.status || "error",
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({
      stdout: execution.stdout,
      stderr: execution.stderr,
      status: execution.status,
    });

  } catch (err) {
    next(err);
  }
};
