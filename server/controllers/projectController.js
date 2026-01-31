import Project from "../models/projectmodel.js";
import File from "../models/filemodel.js";
import archiver from "archiver";


// Create a new project
export const createProject = async (req, res) => {
  console.log(req.body);
  try {
    const userId=req.user.id;
    const { projectName, language, code } = req.body;
    const project = await Project.create({userId, projectName, language, code });
    console.log("project created",project)
    res.status(201).json({ message: "Project created", project });
  } catch (err) {
    if (err.code === 11000) { return res.status(409).json({ error: "Project name already exists for this user" }); } console.error(err); res.status(500).json({ error: "Internal Server Error" });
   // res.status(500).json({ message: "Error creating project", error: error.message });
  }
};

// Get all projects
export const getProjects = async (req, res) => {
  try {
    const userId=req.user.id;
    const projects = await Project.find({userId}).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
};
// Get single project with files
export const getProjectById= async (req, res, next) => {
  try {
    console.log("in project id")
    //const { projectId } = req.params;
    const {id} = req.params;
    
    const project = await Project.findById(id);
    if (!project) throw { statusCode: 404, message: "Project not found" };

    const files = await File.find({projectId:id});
    
    res.json({ success: true, project, files });
  } catch (err) {
    next(err);
  }
};


// Update project
export const updateProject = async (req, res) => {
  try {
    const { projectName, language, code } = req.body;
    const project = await Project.findByIdAndUpdate(
      {
      _id: req.params.id,
      userId: req.user.id
    },
      { projectName, language, code },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project updated", project });
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error: error.message });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {

    const project = await Project.findByIdAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
     await File.deleteMany({ projectId :req.params.id});
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error: error.message });
  }
};


export const downloadProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const files = await File.find({ projectId, isFolder: false });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${project.projectName || "project"}.zip`
    );
    res.setHeader("Content-Type", "application/zip");

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", err => next(err));
    archive.pipe(res);

    // 🧠 Append files
    if (files.length === 0) {
      archive.append("", { name: "README.txt" });
    } else {
      files.forEach(file => {
        if (!file.path || !file.fileName) return;

        const entryName = file.path.trim();
        if (!entryName) return;

        archive.append(file.code || "", { name: entryName });
      });
    }

    await archive.finalize();
  } catch (err) {
    next(err);
  }
};

export const moveFolder = async (req, res, next) => {
  try {
    const { projectId, oldFolderPath, newFolderPath } = req.body;

    // Use a Regex to find all files inside the old folder
    // The '^' ensures we only match paths starting with the oldFolderPath
    const filesToMove = await File.find({ 
      projectId, 
      folderPath: new RegExp(`^${oldFolderPath}`) 
    });

    const updates = filesToMove.map(file => {
      // Replace the old part of the path with the new part
      const updatedPath = file.folderPath.replace(oldFolderPath, newFolderPath);
      return File.findByIdAndUpdate(file._id, { folderPath: updatedPath });
    });

    await Promise.all(updates);
    res.json({ success: true, message: "Folder and contents moved" });
  } catch (err) {
    next(err);
  }
};
// controllers/projectController.js
export const renameProject = async (req, res) => {
  console.log("projectname newname");
  const { projectId }=req.params
  const { projectName } = req.body;
console.log(projectId);
console.log(projectName);
  if (!projectName || projectName.trim() === "") {
    return res.status(400).json({ message: "New project name is required" });
  }

  try {
    // We only update the parent. The children stay linked via projectId.
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { projectName },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project renamed successfully",
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};