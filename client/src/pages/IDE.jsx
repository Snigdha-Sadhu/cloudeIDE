import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "../components/codeeditor/Editor";
import Terminal from "../components/codeeditor/Terminal";
import EditorTabs from "../components/codeeditor/EditorTabs";
import Sidebar from "../components/codeeditor/SideBar.jsx";
import axios from "axios";
import _ from "lodash";
import API from "../API/api";
import { formatCode } from "../Utils/formatter";
const IDE = () => {
  const { projectId } = useParams();
console.log(projectId);
  const [projectName, setProjectName] = useState("");
  const[language,setLanguage]=useState("");
  const [files, setFiles] = useState([]);
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [terminalOutput, setTerminalOutput] = useState("");
  

  // 🔹 Fetch project files + project name
  const fetchFiles = async () => {
    try {
      const filesRes = await API.get(`/project/${projectId}`);
      console.log("filename",filesRes);
      setFiles(filesRes.data.files);

      const projectRes = await API.get(`/project/${projectId}`);
      console.log("projectname",projectRes.data.project.projectName)
      setProjectName(projectRes.data.project.projectName);
      setLanguage(projectRes.data.project.language);
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

  useEffect(() => {
    if (projectId) fetchFiles();
  }, [projectId]);

  // 🔹 Debounced auto-save
  const debouncedSave = useCallback(
    _.debounce(async (fileId, newCode) => {
      try {
        await API.patch(`/file/${fileId}`, { code: newCode });
        console.log("Saved");
      } catch (err) {
        console.error("Auto-save failed", err);
      }
    }, 1000),
    []
  );
const handleSnapshot = async () => {
  if (!activeFile) return;

  try {
    const response = await API.post(`/file/snapshot/${activeFile._id}`);
    
    // Update your local state so the UI knows there's a new snapshot
    const updatedFile = { ...activeFile, snapshots: response.data.snapshots };
    setActiveFile(updatedFile);
    
    alert("Snapshot created successfully!");
  } catch (err) {
    console.error("Snapshot failed", err);
  }
};
  const handleCodeChange = (newCode) => {
    if (!activeFile) return;

    const updatedFile = { ...activeFile, code: newCode };
    setActiveFile(updatedFile);

    setOpenFiles((prev) =>
      prev.map((f) => (f._id === activeFile._id ? updatedFile : f))
    );

    setFiles((prev) =>
      prev.map((f) => (f._id === activeFile._id ? updatedFile : f))
    );

    debouncedSave(activeFile._id, newCode);
  };
const handleRollback = async (snapshotCode) => {
  if (!snapshotCode || !activeFile) return;

  const confirmRestore = window.confirm(
    "Restore this version? Your current changes will be replaced."
  );

  if (confirmRestore) {
    const updatedFile = { ...activeFile, code: snapshotCode };

    // 1. Update the Active File (Updates the Editor)
    setActiveFile(updatedFile);

    // 2. Update the Open Files (Updates the Tabs)
    setOpenFiles((prev) =>
      prev.map((f) => (f._id === activeFile._id ? updatedFile : f))
    );

    // 3. Update the Global Files (Updates the Sidebar/Explorer)
    setFiles((prev) =>
      prev.map((f) => (f._id === activeFile._id ? updatedFile : f))
    );

    // 4. Save to Database immediately (no need to debounce for a rollback)
    try {
      await API.patch(`/file/${activeFile._id}`, { code: snapshotCode });
    } catch (err) {
      console.error("Failed to persist rollback:", err);
    }
  }
};

  const handleFileClick = (file) => {
    if (!openFiles.find((f) => f._id === file._id)) {
      setOpenFiles((prev) => [...prev, file]);
    }
    setActiveFile(file);
  };

  const handleRunCode = async () => {
    if (!activeFile) return;

    setTerminalOutput("Running...\n");

    try {
      console.log("activefile name is",activeFile.fileName)
      const res = await API.post("/execute/run", {
        fileId:activeFile._id,
        userFileName:activeFile.fileName,
        projectId,
        language: activeFile.language,
        code: activeFile.code,
         
      });
     
    // Destructure the specific fields you are getting now
    const { stdout, stderr } = res.data;

    if (stderr) {
      // If there's an error, show it (you can add a prefix)
      setTerminalOutput(stderr);
    } else {
      // If no error, show the regular output
      setTerminalOutput(stdout || "Execution finished with no output.");
    }
  } catch (error) {
    setTerminalOutput(`Connection Error: ${error.message}`);
  }
  };
  const handleExport = () => {
  if (!activeFile) return;

  // 1. Get the extension from the filename (e.g., 'main.cpp' -> 'cpp')
  // This ensures the browser knows exactly what it's saving
  const blob = new Blob([activeFile.code], { type: "application/octet-stream" });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.href = url;
  
  // 2. IMPORTANT: activeFile.name must include the extension (e.g. "main.py")
  // If your name is just "main", add a default extension
  link.download = activeFile.name || "code_export.txt"; 
  
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const handleFormat = async () => {
  if (!activeFile) return;

  const beautifulCode = await formatCode(activeFile.code, activeFile.fileName);
  
  // Use your existing change handler to update state and trigger auto-save
  handleCodeChange(beautifulCode);
};
  return (
    <div className="flex h-screen bg-[#1e1e1e] text-white overflow-hidden">
      <Sidebar
        files={files}
        projectId={projectId}
        projectName={projectName}
        language={language}
        onFileClick={handleFileClick}
        refreshFiles={fetchFiles}
      />

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#252526] px-4 py-2 border-b border-[#333]">
          <h2 className="text-xs uppercase font-bold text-gray-400">
            Workspace: {projectName || "Loading..."}
          </h2>
<div className="flex items-center justify-between bg-[#1e1e1e] p-2 border-b border-[#333]">
  <div className="flex items-center gap-2">
    {/* 1. MAIN ACTIONS */}
    <button
      onClick={handleRunCode}
      className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-sm font-bold transition-colors flex items-center gap-1"
    >
      ▶ Run
    </button>

    {/* 2. FORMATTING */}
    <button
      onClick={handleFormat}
      className="bg-[#3e3e3e] hover:bg-[#4e4e4e] px-3 py-1 rounded text-sm text-gray-200 transition-all flex items-center gap-1"
    >
      <span>🪄</span> Format
    </button>

    {/* 3. SNAPSHOT (SAVE VERSION) */}
    <button
      onClick={handleSnapshot}
      className="bg-[#2d4a63] hover:bg-[#3d5a73] px-3 py-1 rounded text-sm text-blue-100 transition-all flex items-center gap-1"
      title="Save a version snapshot"
    >
      <span>📸</span> Snapshot
    </button>

    {/* 4. HISTORY DROPDOWN */}
    {activeFile?.snapshots?.length > 0 && (
      <select 
        onChange={(e) => handleRollback(e.target.value)}
        className="bg-[#252526] text-gray-300 text-xs p-1 rounded border border-[#454545] outline-none cursor-pointer hover:border-blue-500"
        value="" 
      >
        <option value="" disabled>🕒 History</option>
        {activeFile.snapshots.map((snap, index) => (
          <option key={index} value={snap.code}>
            Version {activeFile.snapshots.length - index} ({new Date(snap.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
          </option>
        ))}
      </select>
    )}

    {/* 5. EXPORT (DOWNLOAD) */}
    <button
      onClick={handleExport}
      className="bg-[#3e3e3e] hover:bg-[#4e4e4e] px-3 py-1 rounded text-sm text-gray-200 transition-all flex items-center gap-1"
      title="Download file"
    >
      <span>📥</span> Export
    </button>
    
  </div>

        </div>
</div>
        <EditorTabs
          openFiles={openFiles}
          activeFile={activeFile}
          onTabClick={setActiveFile}
          onTabClose={(id) => {
            const remaining = openFiles.filter((f) => f._id !== id);
            setOpenFiles(remaining);
            if (activeFile?._id === id)
              setActiveFile(remaining[0] || null);
          }}
        />

        <div className="flex-1 relative overflow-hidden">
          <CodeEditor file={activeFile} onCodeChange={handleCodeChange} />
        </div>
       
        <div className="h-48 bg-black border-t border-[#333] flex-none overflow-hidden">
          <Terminal output={terminalOutput} />
        </div>
       
      </div>
    </div>
  );
};

export default IDE;
