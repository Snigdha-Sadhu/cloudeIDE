import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../API/api";
import { AuthContext } from '../context/AuthContext';
import { useContext } from "react";
const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuPos, setMenuPos] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
const [isRenaming, setIsRenaming] = useState(null); // Stores ID of project being renamed
const [newName, setNewName] = useState("");
const {logout}=useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Your middleware handles the userId, so we just get all projects
        const res = await API.get("/project");
        console.log("data",res.data);
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);
  const handleLogout= async()=>{
try {
      await logout();
      navigate('/');
    } catch {
      alert('Logout failed');
    }
  }
const handleContextMenu = (e, project) => {
  e.preventDefault();
  e.stopPropagation();
  setSelectedProject(project); // Capture which project we clicked
  setMenuPos({ x: e.clientX, y: e.clientY });
};
const handleDelete = async () => {
  if (!selectedProject) return;
  if (window.confirm(`Delete project "${selectedProject.projectName}"?`)) {
    try {
      await API.delete(`/project/${selectedProject._id}`);
      setProjects(projects.filter(p => p._id !== selectedProject._id));
      setMenuPos(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  }
};
const handleRename = async () => {
  try {
    await API.patch(`/project/rename/${isRenaming}`, { projectName: newName });
    setProjects(projects.map(p => p._id === isRenaming ? { ...p, projectName: newName } : p));
    setIsRenaming(null);
    setNewName("");
  } catch (err) {
    console.error("Rename failed", err);
  }
};
const handleDownloadWorkspace = async (project) => {
  try {
    const res = await API.get(
      `/project/${project._id}/download`,
      { responseType: "blob" }
    );

    const blob = new Blob([res.data], { type: "application/zip" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.projectName || "project"}.zip`;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Workspace download failed", err);
    alert("Failed to download workspace");
  }
};

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Workspaces</h1>
          <p className="text-gray-400 mt-1">Select a workspace to continue coding.</p>
        </div>
        <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm transition-all" onClick={handleLogout}>
          Log Out
        </button>
      </header>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Create New Project Card */}
        <div 
          onClick={() => navigate("/create-project")}
          className="border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-blue-500 transition-all">
            <span className="text-2xl">+</span>
          </div>
          <p className="mt-4 font-semibold"> Create New Workspace</p>
        </div>
{projects.length === 0 && !loading && (
  <div className="col-span-full py-20 text-center border border-gray-800 rounded-xl">
    <p className="text-gray-500 italic">No workspace found.Create one to get started!</p>
  </div>
)}
        {/* Existing Project Cards */}
       {projects.map((project) => (
  <div 
    key={project._id}
    onContextMenu={(e) => handleContextMenu(e, project)} // 🔹 Pass project object
    onClick={() => isRenaming !== project._id && navigate(`/project/${project._id}`)}
    className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-gray-600 transition-all relative"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-blue-500/10 rounded-lg">
        <span className="text-blue-500 font-bold uppercase text-xs">
          {project.language.slice(0, 2)}
        </span>
      </div>
    </div>

    {isRenaming === project._id ? (
      <input
        autoFocus
        className="bg-gray-800 text-white px-2 py-1 rounded w-full mb-2 outline-none border border-blue-500"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleRename();
          if (e.key === 'Escape') setIsRenaming(null);
        }}
        onClick={(e) => e.stopPropagation()} // Prevent card click
      />
    ) : (
      <h3 className="text-lg font-bold mb-1 truncate">{project.projectName}</h3>
    )}
    
    <p className="text-xs text-gray-500 mb-6 uppercase tracking-widest">{project.language}</p>
    
    <div className="flex items-center text-sm text-blue-400 font-medium">
      Open Editor <span className="ml-2">→</span>
    </div>
  </div>
))}
      </div>

      {loading && (
        <div className="flex justify-center mt-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
        </div>
      )}
      {/* 🔹 CONTEXT MENU */}
{menuPos && (
  <>
    <div className="fixed inset-0 z-40" onClick={() => setMenuPos(null)} />
    <div 
      className="fixed z-50 bg-[#252526] border border-[#454545] shadow-xl py-1 rounded text-white min-w-[120px]"
      style={{ top: menuPos.y, left: menuPos.x }}
    >
      <div 
        className="px-4 py-2 hover:bg-[#094771] cursor-pointer text-sm"
        onClick={() => { 
          setIsRenaming(selectedProject._id); 
          setNewName(selectedProject.projectName);
          setMenuPos(null); 
        }}
      >
        Rename
      </div>
      
      {/* DOWNLOAD WORKSPACE */}
      <div
        className="px-4 py-2 hover:bg-[#094771] cursor-pointer text-sm"
        onClick={() => {
          handleDownloadWorkspace(selectedProject);
          setMenuPos(null);
        }}
      >
        Download Workspace
      </div>
      <div 
        className="px-4 py-2 hover:bg-[#094771] cursor-pointer text-sm text-red-400"
        onClick={handleDelete}
      >
        Delete
      </div>
    </div>
  </>
)}
    </div>
  );
};

export default Dashboard;