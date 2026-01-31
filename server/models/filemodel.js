import mongoose from "mongoose";


const fileSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    // 🔑 ONE source of truth
    path: {
      type: String,
      required: true
    },

    // convenience (last part of path)
    fileName: {
      type: String,
      required: true
    },

    isFolder: {
      type: Boolean,
      default: false
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
    "racket"],
      required: function () {
        return !this.isFolder;
      }
    },

    code: {
      type: String,
      default: ""
    },
    snapshots: [
    {
      code: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
  },
  { timestamps: true }
);

// 🔒 prevent duplicate paths in same project
fileSchema.index({ projectId: 1, path: 1 }, { unique: true });

// fast project lookup
fileSchema.index({ projectId: 1 });

export default mongoose.model("File", fileSchema);
