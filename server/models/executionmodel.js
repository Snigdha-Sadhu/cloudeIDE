import mongoose from "mongoose";

const executionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
     projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null, // optional if file is standalone
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      default: null,
      required: true,
    },
    language: {
      type: String,
       enum: ["python", "javascript", "c", "cpp", "java"],
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    stdin: {
      type: String,
      default: "",
    },
    stdout: {
      type: String,
      default: "",
    },
    stderr: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["success", "error"],
      required: true,
    },
  },
  { timestamps: true }
);
executionSchema.index(
  { userId: 1, fileId: 1 },
  { unique: true, sparse: true }
);
export default mongoose.model("Execution", executionSchema);
