import FileNode from "./FileNode";
import { useState } from "react";
import { buildFileTree } from "../../Utils/fileTree";
import API from "../../API/api";

const Sidebar = ({ files, projectId, projectName, language, onFileClick, refreshFiles }) => {
  const [isCreating, setIsCreating] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [currentFolderPath, setCurrentFolderPath] = useState("");
  const [isSidebarFocused, setIsSidebarFocused] = useState(false); // New Focus State

  const tree = buildFileTree(files);

  const handleCreate = async (e) => {
    if (e.key !== "Enter" || !inputValue) return;
    try {
      await API.post("/file/create", {
        projectId,
        fileName: inputValue,
        language,
        _isFolder: isCreating === "folder",
        folderPath: currentFolderPath || ""
      });
      setInputValue("");
      setIsCreating(null);
      refreshFiles();
    } catch (err) {
      console.error("Creation failed", err);
    }
  };
const saveFileToDB = async (fileName, importedCode = "") => {
  console.log("here in savedb");
  console.log(importedCode)
  return await API.post("/file/create", {
    projectId,
    fileName,
    code: importedCode, // Now you can save the imported text!
    language, 
    _isFolder: false,
    folderPath: currentFolderPath
  || ""
  });
};
const handleImport = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  
  reader.onload = async (event) => {
    const importedCode = event.target.result;
    const fileName = file.name;

    // Call your existing function that creates a new file in the DB
    // Assuming you have a function like handleCreateFile(name, initialCode)
    try {
      await saveFileToDB(fileName, importedCode);
      refreshFiles();
      console.log("File imported successfully!");
    } catch (err) {
      console.error("Import failed", err);
    }
  };

  reader.readAsText(file);
};
  return (
    <div 
      className={`w-64 bg-[#252526] flex flex-col h-full border-r border-[#333] transition-all duration-150 ${
        isSidebarFocused ? "ring-1 ring-inset ring-blue-500/50" : ""
      }`}
      onClick={() => setIsSidebarFocused(true)}
      onBlur={() => setIsSidebarFocused(false)}
      tabIndex="0" // Makes the sidebar focusable
    >
      {/* Header */}
      <div className="flex-none flex items-center justify-between p-3 border-b border-gray-800" onClick={(e) => e.stopPropagation()}>
        <div 
  className="flex-none flex items-center justify-between p-2 pl-3 bg-[#1e1e1e] border-b border-gray-800 select-none" 
  onClick={(e) => e.stopPropagation()}
>
  {/* Project Label */}
  <div className="flex items-center gap-2 overflow-hidden">
    <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest truncate">
      Explorer: {projectName}
    </span>
  </div>

  {/* Action Bar */}
  <div className="flex items-center gap-0.5">
    {/* New File Button */}
    <button 
      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-md transition-all group" 
      onClick={() => setIsCreating("file")} 
      title="New File"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </button>

    {/* New Folder Button */}
    <button 
      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-md transition-all" 
      onClick={() => setIsCreating("folder")} 
      title="New Folder"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h2.293a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293h7.586a1 1 0 011 1v12a2 2 0 01-2 2z" />
      </svg>
    </button>

    {/* Vertical Divider */}
    <div className="w-[1px] h-4 bg-gray-800 mx-1" />

    {/* Import Label/Button */}
    <label 
      className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-md cursor-pointer transition-all" 
      title="Import File"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
      <input 
        type="file" 
        className="hidden" 
        onChange={handleImport} 
        accept=".cpp,.py,.js,.java,.c,.txt" 
      />
    </label>
  </div>
</div>
      </div>

      {/* Input Box */}
      {isCreating && (
        <div className="flex-none px-3 py-2 bg-[#2d2d2d]">
          <div className="text-[10px] text-blue-400 mb-1">Creating in: /{currentFolderPath}</div>
          <input
            autoFocus
            className="bg-[#3c3c3c] text-sm w-full p-1 outline-none border border-blue-500 text-white"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleCreate}
            onBlur={() => setIsCreating(null)}
          />
        </div>
      )}

      {/* File Tree + Empty Space Container */}
      <div 
        className="flex-1 overflow-y-auto flex flex-col" 
        onClick={() => setCurrentFolderPath("")} // Click here resets to root
      >
        {/* Actual Files */}
        <div className="p-2 space-y-1" onClick={(e) => e.stopPropagation()}>
          {Object.entries(tree).map(([name, node]) => (
            <FileNode
              key={name}
              name={name}
              node={node}
              onFileClick={onFileClick}
              onFolderClick={setCurrentFolderPath} 
              projectId={projectId}
              parentPath="" 
              refreshFiles={refreshFiles}
            />
          ))}
          {files.length === 0 && !isCreating && (
            <p className="text-gray-500 text-xs p-2 italic">Empty Project</p>
          )}
        </div>

        {/* 🟢 THE MAGIC BLANK SPACE 🟢 */}
        {/* This div fills the remaining height and handles the "Root" click */}
        <div className="flex-1 cursor-default min-h-[50px]" />
      </div>
    </div>
  );
};

export default Sidebar;