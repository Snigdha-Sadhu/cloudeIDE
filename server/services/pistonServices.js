/*import axios from "axios";

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

const fileNames = {
  python: "main.py",
  javascript: "main.js",
  c: "main.c",
  cpp: "main.cpp",
  java: "Main.java",
};

export const executeCode = async (language, code, stdin = "") => {
  try {
    const payload = {
      language,
      version: "*",
      files: [
        {
          name: fileNames[language],
          content: code,
        },
      ],
      stdin,
    };

    const response = await axios.post(PISTON_URL, payload);

    const run = response.data.run || {};
    const compile = response.data.compile || {};

    return {
      stdout: run.stdout || "",
      stderr: run.stderr || "",
      compile_output: compile.stderr || "",
      status: "success",
    };
  } catch (error) {
    return {
      stdout: "",
      stderr: error.response?.data || error.message,
      compile_output: "",
      status: "error",
    };
  }
};

import axios from "axios";

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

// Get file extension from language
const getExtension = (language) => {
  const extensions = {
    python: ".py",
    javascript: ".js",
    c: ".c",
    cpp: ".cpp",
    java: ".java",
    go: ".go",
    rust: ".rs",
    typescript: ".ts",
    php: ".php",
    ruby: ".rb",
  };
  return extensions[language] || ".txt";
};

// Extract class name from Java code
const getJavaClassName = (code) => {
  const match = code.match(/public\s+class\s+(\w+)/);
  return match ? match[1] : "Main";
};

// Generate appropriate filename based on language and code
const generateFileName = (language, code, userFileName) => {
  if (language === "java") {
    // For Java, extract class name from code
    const className = getJavaClassName(code);
    return `${className}.java`;
  }
  
  // For other languages, use user's filename with correct extension
  if (userFileName) {
    const extension = getExtension(language);
    // Remove existing extension if any and add correct one
    const nameWithoutExt = userFileName.replace(/\.[^/.]+$/, "");
    return `${nameWithoutExt}${extension}`;
  }
  
  // Fallback
  const defaults = {
    python: "main.py",
    javascript: "main.js",
    c: "main.c",
    cpp: "main.cpp",
    go: "main.go",
    rust: "main.rs",
  };
  return defaults[language] || "main.txt";
};

export const executeCode = async (language, code, stdin = "", userFileName = null) => {
  try {
    const fileName = generateFileName(language, code, userFileName);

    const payload = {
      language,
      version: "*",
      files: [
        {
          name: fileName,
          content: code,
        },
      ],
      stdin,
    };

    const response = await axios.post(PISTON_URL, payload);

    const run = response.data.run || {};
    const compile = response.data.compile || {};

    return {
      stdout: run.stdout || "",
      stderr: run.stderr || "",
      compile_output: compile.stderr || "",
      status: "success",
    };
  } catch (error) {
    return {
      stdout: "",
      stderr: error.response?.data || error.message,
      compile_output: "",
      status: "error",
    };
  }
};*/
import axios from "axios";

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

// Get file extension from language
const getExtension = (language) => {
  const extensions = {
    python: ".py",
    python3: ".py",
    javascript: ".js",
    typescript: ".ts",
    c: ".c",
    cpp: ".cpp",
    java: ".java",
    csharp: ".cs",
    go: ".go",
    rust: ".rs",
    php: ".php",
    ruby: ".rb",
    kotlin: ".kt",
    swift: ".swift",
    dart: ".dart",
    scala: ".scala",
    elixir: ".ex",
    erlang: ".erl",
    racket: ".rkt",
  };
  return extensions[language] || ".txt";
};

// Extract class name from Java code
const getJavaClassName = (code) => {
  const match = code.match(/public\s+class\s+(\w+)/);
  return match ? match[1] : "Main";
};

// Check if filename extension matches the selected language
const validateFileExtension = (fileName, language) => {
  if (!fileName) return true; // No filename provided, skip validation
  
  const expectedExtension = getExtension(language);
  const fileExtension = fileName.includes('.') 
    ? '.' + fileName.split('.').pop() 
    : '';
  
  return fileExtension.toLowerCase() === expectedExtension.toLowerCase();
};

// Generate appropriate filename based on language and code
const generateFileName = (language, code, userFileName) => {
  if (language === "java") {
    const className = getJavaClassName(code);
    return `${className}.java`;
  }
  
  if (userFileName) {
    const extension = getExtension(language);
    const nameWithoutExt = userFileName.replace(/\.[^/.]+$/, "");
    return `${nameWithoutExt}${extension}`;
  }
  
  const defaults = {
    python: "main.py",
    python3: "main.py",
    javascript: "main.js",
    typescript: "main.ts",
    c: "main.c",
    cpp: "main.cpp",
    java: "Main.java",
    csharp: "Program.cs",
    go: "main.go",
    rust: "main.rs",
    php: "index.php",
    ruby: "main.rb",
    kotlin: "Main.kt",
    swift: "main.swift",
    dart: "main.dart",
    scala: "Main.scala",
    elixir: "main.ex",
    erlang: "main.erl",
    racket: "main.rkt",
  };
  return defaults[language] || "main.txt";
};

export const executeCode = async (language, code, stdin = "", userFileName = null) => {
  try {
    // Validate filename extension matches language
    if (userFileName && !validateFileExtension(userFileName, language)) {
      const expectedExt = getExtension(language);
      const currentExt = userFileName.includes('.') 
        ? '.' + userFileName.split('.').pop() 
        : 'no extension';
      
      return {
        stdout: "",
        stderr: `Error: File extension mismatch!\nFile: ${userFileName} (${currentExt})\nSelected Language: ${language.toUpperCase()} (requires ${expectedExt})\n\nPlease either:\n- Change the language to match your file, or\n- Rename your file with ${expectedExt} extension`,
        compile_output: "",
        status: "error",
      };
    }

    const fileName = generateFileName(language, code, userFileName);

    const payload = {
      language,
      version: "*",
      files: [
        {
          name: fileName,
          content: code,
        },
      ],
      stdin,
    };

    const response = await axios.post(PISTON_URL, payload);

    const run = response.data.run || {};
    const compile = response.data.compile || {};

    return {
      stdout: run.stdout || "",
      stderr: run.stderr || "",
      compile_output: compile.stderr || "",
      status: "success",
    };
  } catch (error) {
    return {
      stdout: "",
      stderr: error.response?.data || error.message,
      compile_output: "",
      status: "error",
    };
  }
};
