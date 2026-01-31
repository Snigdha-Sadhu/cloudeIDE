import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ["cpp",       // C++
    "java",
    "python3",
    "python",
    "javascript",
    "typescript",
    "csharp",
    "c",
    "go",
    "kotlin",
    "swift",
    "rust",
    "ruby",
    "php",
    "dart",
    "scala",
    "elixir",
    "erlang",
    "racket"], // standardized
      required: true,
    },
    code: {
      type: String,
      default: "", // optional for single-file projects
    },
    description: { type: String, default: "" },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent duplicate project names per user
projectSchema.index({ userId: 1, projectName: 1 }, { unique: true });

export default mongoose.model("Project", projectSchema);
