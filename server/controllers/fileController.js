// controllers/fileController.js
import File from "../models/filemodel.js";

// Create new file
export const createFile = async (req, res, next) => {
  try {
    console.log("in file creation");
    const userId = req.user?.id || null;

    const {
      projectId,
      fileName,          // file or folder name
      folderPath = "", // "" or "src/components"
      _isFolder = false,
      language = null,
      code="",
    } = req.body;
console.log("code",code)
    if (!fileName) {
      throw { statusCode: 400, message: "Name is required" };
    }

    // 🔑 Build FULL PATH here (MOST IMPORTANT)
    const fullPath = folderPath
      ? `${folderPath}/${fileName}`
      :fileName;
console.log(fileName,folderPath,fullPath);
    const file = await File.create({
      projectId: projectId || null,
      userId,
     fileName,
     code,
      path: fullPath,     // 🔥 FULL PATH STORED
      isFolder: _isFolder,
      language: _isFolder ? null : language
    });

    res.status(201).json({ success: true, file });
  } catch (err) {
    next(err);
  }
};

// Get all files in a project (or all standalone files)
export const getFiles = async (req, res, next) => {
  try {
    const { projectId } = req.query;

    let filter = {};
    if (projectId) filter.projectId = projectId;

    const files = await File.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, files });
  } catch (err) {
    next(err);
  }
};

// Get single file
export const getFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);
    if (!file) throw { statusCode: 404, message: "File not found" };

    res.json({ success: true, file });
  } catch (err) {
    next(err);
  }
};

// controllers/fileController.js
export const updateFileCode = async (req, res) => {
  const { fileId } = req.params; // Get ID from URL
  const { code } = req.body;     // Get new code from body

  try {
    const updatedFile = await File.findByIdAndUpdate(
      fileId, 
      { code: code }, 
      { new: true } // Returns the document AFTER the update
    );

    if (!updatedFile) {
      return res.status(404).json({ message: "File not found" });
    }

    res.status(200).json({ message: "Code saved", file: updatedFile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update file code or name
export const renameFileOrFolder = async (req, res) => {
  const { projectId, oldPath, newName } = req.body;

  try {
    // 1. Calculate the new path
    const pathParts = oldPath.split('/');
    pathParts[pathParts.length - 1] = newName;
    const newPath = pathParts.join('/');

    // 2. Find the item to see if it's a folder
    const item = await File.findOne({ projectId, path: oldPath });
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.isFolder) {
      // RENAME FOLDER & ALL CHILDREN
      // Use a bulk write or multiple updates
      // First, rename the folder itself
      await File.updateOne({ _id: item._id }, { path: newPath, fileName: newName });

      // Then, update all children using a regex replace
      // This looks for anything starting with "oldPath/"
      const children = await File.find({
        projectId,
        path: new RegExp(`^${oldPath}/`)
      });

      const updatePromises = children.map(child => {
      const updatedChildPath = newPath + child.path.substring(oldPath.length);
        return File.updateOne({ _id: child._id }, { path: updatedChildPath });
      });

      await Promise.all(updatePromises);
    } else {
      // RENAME SINGLE FILE
      await File.updateOne(
        { projectId, path: oldPath },
        { path: newPath, fileName: newName }
      );
    }

    res.status(200).json({ message: "Renamed successfully", newPath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Delete file
export const deleteFileorFolder = async (req, res) => {
  // Destructure the data sent from frontend
  const { projectId, path, isFolder } = req.body;

  console.log("--- ATTEMPTING DELETE ---");
  console.log("Target Path:", path);
  console.log("Project ID:", projectId);

  try {
    if (isFolder) {
      // 1. Delete the folder itself
      await File.deleteOne({ projectId, path, isFolder: true });

      // 2. Delete everything inside (Recursive Delete)
      // Since your schema uses a full 'path' string, we look for anything 
      // starting with "folderPath/"
      const result = await File.deleteMany({
        projectId,
        path: new RegExp(`^${path}/`) 
      });
      
      console.log(`🗑️ Folder and ${result.deletedCount} internal items deleted.`);
    } else {
      // 3. Delete a single file
      // We use the exact 'path' string provided by the frontend
      const result = await File.deleteOne({ 
        projectId, 
        path: path, 
        isFolder: false 
      });

      if (result.deletedCount > 0) {
        console.log("✅ File deleted successfully from MongoDB");
      } else {
        console.log("❌ Delete failed: No document matched the query.");
      }
    }

    res.status(200).json({ message: "Delete processed" });
  } catch (err) {
    console.error("🔥 Database Error:", err);
    res.status(500).json({ error: err.message });
  }
};
// PATCH /file/move
export const moveFile = async (req, res, next) => {
  console.log("in moving");
  try {
    const { projectId, sourcePath, targetFolderPath } = req.body;

    // get the item
    const item = await File.findOne({ projectId, path: sourcePath });
    if (!item) return res.status(404).json({ message: "Not found" });

    const newPath = targetFolderPath
      ? `${targetFolderPath}/${item.fileName}`
      : item.fileName;
console.log("Moving folder:", sourcePath, "to", newPath);

    // 🔥 move the item itself
    await File.updateOne(
      { _id: item._id },
      { $set: { path: newPath } }
    );

    // 🔥 if folder → move all children
    if (item.isFolder) {
      await File.updateMany(
        {
          projectId,
          path: { $regex: `^${sourcePath}/` }
        },
        [
          {
            $set: {
              path: {
                $concat: [
                  newPath,
                  "/",
                  { $substr: ["$path", sourcePath.length + 1, -1] }
                ]
              }
            }
          }
        ],
      { updatePipeline: true }  
      );
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
// controllers/fileController.js
export const saveSnapshot = async (req, res) => {
  const { fileId } = req.params;

  try {
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    // 1. Push current code to the snapshots array
    // unshift adds to the START of the array
    file.snapshots.unshift({ code: file.code });

    // 2. Keep only the last 5 versions (to save space)
    if (file.snapshots.length > 5) {
      file.snapshots = file.snapshots.slice(0, 5);
    }

    await file.save();
    res.status(200).json({ message: "Snapshot saved", snapshots: file.snapshots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};