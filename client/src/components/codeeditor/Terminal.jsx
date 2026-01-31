const Terminal = ({ output }) => {
  const isError = output.includes("Error:") || output.includes("ReferenceError") || output.includes("StackTrace");

  return (
    <div className="h-full bg-black p-4 overflow-y-auto font-mono text-sm">
      <div className="text-green-500 mb-2">Terminal:</div>
     <pre className={`whitespace-pre-wrap ${isError ? "text-red-400" : "text-green-400"}`}>
        {output}
      </pre>
    </div>
  );
};

export default Terminal;
