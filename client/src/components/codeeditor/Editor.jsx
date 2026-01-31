import Editor from "@monaco-editor/react";

const CodeEditor = ({ file, onCodeChange }) => {
  return (
    <div className="flex-1 h-full bg-[#1e1e1e]">
      {file ? (
        <Editor
          height="100%"
          theme="vs-dark"
          language={file?.language || "javascript"}
          value={file?.code || ""}
          onChange={(value) => onCodeChange(value)}
          options={{ 
            fontSize: 14, 
            minimap: { enabled: false },
            automaticLayout: true,
          }}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Select a file to start editing</p>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;