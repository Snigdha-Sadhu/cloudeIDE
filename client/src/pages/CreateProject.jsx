import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../API/api";

const CreateProject = () => {
  const [formData, setFormData] = useState({ projectName: "", language: "javascript" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // This request creates the project in MongoDB
      const res = await API.post("/project/create", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // On success, go straight to the new IDE workspace!
      console.log("response in project creation",res.data)
      console.log(res.data.project._id);
      navigate(`/project/${res.data.project._id}`);
    } catch (err) {
      alert("Error creating project. Try a unique name.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Create New Workspace</h2>
        <p className="text-gray-400 text-sm mb-8">Setup your workspace environment.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Workspace Name</label>
            <input 
              required
              className="w-full bg-[#252526] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all"
              placeholder="my-cool-app"
              onChange={(e) => setFormData({...formData, projectName: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Language</label>
            <select 
              className="w-full bg-[#252526] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 appearance-none"
              onChange={(e) => setFormData({...formData, language: e.target.value})}
            >
             <option value="cpp">C++</option>
    <option value="java">Java</option>
    <option value="python3">Python 3</option>
    <option value="python">Python</option>
    <option value="javascript">JavaScript</option>
    <option value="typescript">TypeScript</option>
    <option value="csharp">C#</option>
    <option value="c">C</option>
    <option value="go">Go</option>
    <option value="kotlin">Kotlin</option>
    <option value="swift">Swift</option>
    <option value="rust">Rust</option>
    <option value="ruby">Ruby</option>
    <option value="php">PHP</option>
    <option value="dart">Dart</option>
    <option value="scala">Scala</option>
    <option value="elixir">Elixir</option>
    <option value="erlang">Erlang</option>
    <option value="racket">Racket</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 bg-transparent border border-gray-700 hover:bg-gray-800 py-3 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 py-3 rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all"
            >
              {loading ? "Creating..." : "Launch IDE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;