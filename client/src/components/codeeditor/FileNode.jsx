
import { useState } from "react";
import API from "../../API/api";

const FileNode = ({ 
  name, 
  node, 
  onFileClick, 
  onFolderClick, 
  projectId, 
  level = 0, 
  parentPath = "", 
  refreshFiles 
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
const [newName, setNewName] = useState(name);
const [menuPos, setMenuPos] = useState(null);
  // Construct the full path for this specific node
  const fullPath = parentPath ? `${parentPath}/${name}` : name;
  const children = node.children || {};

  // 🔹 Drag and Drop Logic
  const handleDragStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ path: fullPath, isFolder: node.isFolder })
    );
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      if (data.path === fullPath || fullPath.startsWith(data.path + "/")) {
        alert("Cannot move folder into itself!");
        return;
      }
      await API.patch("/file/move", {
        projectId,
        sourcePath: data.path,
        targetFolderPath: fullPath
      });
      refreshFiles();
    } catch (err) {
      console.error("Move failed", err);
    }
  };

  // 🔹 Delete Logic
  const handleDelete = async () => {
  
    const type = node.isFolder ? "folder" : "file";
    if (window.confirm(`Delete ${type} "${name}"? This cannot be undone.`)) {
      try {
        const data={projectId, path: fullPath, isFolder: node.isFolder }
        console.log("data is",data);
        await API.delete('/file/delete', {
          data: { projectId, path: fullPath, isFolder: node.isFolder }
        });
        console.log("delete done");
        refreshFiles();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };
// 🔹 Handle Right Click
const handleContextMenu = (e) => {
  e.preventDefault();  // Stop browser menu
  e.stopPropagation(); // Stop parent folders from opening their menu
  setMenuPos({ x: e.clientX, y: e.clientY }); // Save coordinates
};
  const handleFolderToggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    onFolderClick?.(fullPath); // Set this folder as the active creation path
  };
  const handleRename = async () => {
  try {
    await API.patch("/file/rename", {
      projectId,
      oldPath: fullPath,
      newName: newName
    });
    setIsEditing(false);
    refreshFiles();
  } catch (err) {
    console.error("Rename failed", err);
    setNewName(name); // Reset on error
  }
};

  // 🔹 UI Row Renderer (Standardizes File and Folder look)
  const renderRow = () => {
    const isFolder = node.isFolder;
    return (
      <div
        draggable
        onDragStart={handleDragStart}
        onDragOver={(e) => isFolder && e.preventDefault()}
        onContextMenu={handleContextMenu}
        onDrop={isFolder ? handleDrop : undefined}
        onClick={isFolder ? handleFolderToggle : (e) => { e.stopPropagation(); onFileClick(node); }}
        className="group flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-[#2a2d2e] rounded transition-all w-full mb-[1px]"
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-sm flex-shrink-0">
            {isFolder ? (isOpen ? "📂" : "📁") : "📄"}
          </span>
         {isEditing ? (
  <input
    autoFocus
    className="bg-[#3c3c3c] text-white text-sm outline-none border border-blue-500 px-1 rounded w-full"
    value={newName}
    onChange={(e) => setNewName(e.target.value)}
    onBlur={handleRename}
    onKeyDown={(e) => e.key === "Enter" && handleRename()}
    onClick={(e) => e.stopPropagation()} // Stop click from toggling folder
  />
) : (
  <span className={`text-sm truncate ${isFolder ? "font-medium text-gray-200" : "text-gray-400"}`}>
    {name}
  </span>
)}
        </div>

      
      </div>
    );
  };

  

return (
    <div className="w-full relative"> {/* Added relative just in case */}
      {renderRow()}

      {/* 🔹 CONTEXT MENU UI */}
      {menuPos && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[9998] bg-transparent" 
            onClick={() => setMenuPos(null)} 
            onContextMenu={(e) => { e.preventDefault(); setMenuPos(null); }}
          />
          
          {/* Menu Box */}
          <div 
            className="fixed z-[9999] bg-[#252526] border border-[#454545] shadow-xl py-1 rounded text-white min-w-[120px]"
            style={{ 
              top: menuPos.y, 
              left: menuPos.x,
              pointerEvents: 'auto' 
            }}
          >
            <div 
              className="px-4 py-2 hover:bg-[#094771] cursor-pointer text-sm"
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); setMenuPos(null); }}
            >
              Rename
            </div>
            <div 
              className="px-4 py-2 hover:bg-[#094771] cursor-pointer text-sm text-red-400"
              onClick={(e) => { e.stopPropagation(); handleDelete(); setMenuPos(null); }}
            >
              Delete
            </div>
          </div>
        </>
      )}

      {/* 🔹 Children */}
      {node.isFolder && isOpen && (
        <div className="w-full">
          {Object.entries(children).map(([childName, childNode]) => (
            <FileNode
              key={`${fullPath}/${childName}`}
              name={childName}
              node={childNode}
              onFileClick={onFileClick}
              onFolderClick={onFolderClick}
              projectId={projectId}
              level={level + 1}
              parentPath={fullPath}
              refreshFiles={refreshFiles}
            />
          ))}
        </div>
      )}
    </div>
  );
}
export default FileNode;

