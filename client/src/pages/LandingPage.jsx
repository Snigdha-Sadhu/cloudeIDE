import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#050505] text-gray-300 font-mono overflow-hidden flex flex-col">

      {/* --- TOP STATUS BAR --- */}
      <nav className="w-full border-b border-[#1a1a1a] bg-[#050505]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" />
            <span className="text-white font-bold text-xl sm:text-2xl tracking-tighter uppercase">
              CodeSpace
            </span>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="relative flex-1 flex items-center w-full">

        {/* Grid background */}
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* LEFT CONTENT */}
            <div className="space-y-8 text-center lg:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black text-white leading-tight tracking-tighter"
              >
                Execution first <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                  coding workspace
                </span>
              </motion.h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-l-2 border-[#1a1a1a] pl-6 text-left">
                <div>
                  <h3 className="text-white text-xs font-bold uppercase mb-1">
                    Single_File
                  </h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Run code instantly in the cloud with minimal setup.
                  </p>
                </div>
                <div>
                  <h3 className="text-white text-xs font-bold uppercase mb-1">
                    Snapshots
                  </h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Capture code states. Rollback history with one click.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-600 px-8 py-3 text-xs font-bold uppercase tracking-widest text-white border-b-4 border-green-900 active:border-b-0 active:translate-y-1 transition-all"
                  onClick={() => navigate("/signup")}
                >
                  Enter_Workspace
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-600 px-8 py-3 text-xs font-bold uppercase tracking-widest text-white border-b-4 border-green-900 active:border-b-0 active:translate-y-1 transition-all"
                  onClick={() => navigate("/login")}
                >
                  Login
                </motion.button>
              </div>
            </div>

            {/* RIGHT MOCK IDE (hidden on very small screens) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden sm:block bg-[#0d0d0d] border border-[#222] rounded-lg shadow-2xl w-full"
            >
              <div className="bg-[#1a1a1a] px-4 py-3 flex justify-between border-b border-[#222]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                  <div className="w-3 h-3 rounded-full bg-green-500/40" />
                </div>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                  binary_search.cpp
                </span>
              </div>

              <div className="p-6 md:p-8 h-64 md:h-72 font-mono text-sm space-y-2 overflow-hidden">
                <p className="text-gray-500">// Auto-save enabled...</p>
                <p className="text-purple-400">
                  #include <span className="text-green-400">&lt;iostream&gt;</span>
                </p>
                <p className="text-blue-400">
                  int <span className="text-yellow-400">binarySearch</span>(int
                  arr[], int n) {"{"}
                </p>
                <p className="pl-6 text-gray-400">/* Logic goes here */</p>
                <p className="text-blue-400">{"}"}</p>

                <div className="mt-6 flex items-center gap-2">
                  <span className="text-green-500">{">"}</span>
                  <span className="bg-white/20 px-3 py-1 text-[10px] text-white rounded">
                    SNAPSHOT_CREATED: v1.0.2
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full bg-[#050505] border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2 flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-center text-[9px] text-gray-600 uppercase tracking-widest">
          <div className="flex gap-4">
            <span>Language: Multi_Kernel</span>
            <span>Persistence: Cloud_Active</span>
          </div>
          <div className="flex gap-4">
            <span className="text-green-500">Auto_Save: ON</span>
            <span className="text-white">Export: Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
