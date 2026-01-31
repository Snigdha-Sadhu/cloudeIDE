const EditorTabs = ({ openFiles, activeFile, onTabClick, onTabClose }) => {
  return (
    <div className="flex bg-[#2d2d2d] border-b border-gray-800 overflow-x-auto">
      {openFiles.map((file) => (
        <div
          key={file._id}
          className={`flex items-center gap-2 px-4 py-2 border-r border-gray-800 cursor-pointer ${
            activeFile?._id === file._id
              ? "bg-[#1e1e1e] text-white"
              : "text-gray-400 hover:bg-gray-700"
          }`}
          onClick={() => onTabClick(file)}
        >
          <span className="text-sm">{file.fileName}</span>
          <button
            className="text-gray-500 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(file._id);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default EditorTabs;