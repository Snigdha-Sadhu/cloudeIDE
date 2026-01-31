import prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import parserEstree from "prettier/plugins/estree"; // Required for JS
import parserHtml from "prettier/plugins/html";
import parserCss from "prettier/plugins/postcss";

const languageToParser = {
  js: "babel",
  jsx: "babel",
  ts: "babel-ts",
  html: "html",
  css: "css",
  json: "json",
};

export const formatCode = async (code, fileName) => {
    if (!fileName) {
    console.error("Format failed: No filename provided");
    return code;
  }
  const ext = fileName.split(".").pop().toLowerCase();
  const parser = languageToParser[ext];

  // If we don't have a formatter for this language, just return original code
  if (!parser) return code;

  try {
    return await prettier.format(code, {
      parser: parser,
      plugins: [parserBabel, parserEstree, parserHtml, parserCss],
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      printWidth: 80,
    });
  } catch (err) {
    console.error("Formatting failed:", err);
    return code; // Return messy code if there's a syntax error
  }
};