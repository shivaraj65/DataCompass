import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = any;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const relativePath = req.body.path;

  // Directories and files to exclude
  const EXCLUDED_FILES_AND_FOLDERS = [
    // General
    ".git",
    ".svn",
    ".hg",
    "*.log",
    "*.tmp",
    "*.swp",
    "*.bak",
    "*.lock",
    ".DS_Store",
    "Thumbs.db",

    // Build and Distribution
    "dist",
    "build",
    "out",
    "target",
    "node_modules",
    "coverage",

    // Python
    "__pycache__",
    "*.pyc",
    "*.pyo",
    "env",
    ".venv",
    "Pipfile.lock",
    "poetry.lock",

    // JavaScript/Node.js
    "node_modules",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "coverage",
    ".next",
    ".nuxt",

    // Java
    "*.class",
    "*.jar",
    "*.war",
    "*.ear",
    "bin",
    "target",

    // C/C++
    "*.o",
    "*.so",
    "*.out",
    "*.a",

    // Rust
    "target",

    // PHP
    "vendor",
    "composer.lock",

    // Ruby
    "vendor",
    "bundle",
    "Gemfile.lock",

    // Dart
    ".dart_tool",
    "pubspec.lock",

    // Haskell
    ".stack-work",
  ];

  if (!relativePath || typeof relativePath !== "string") {
    res.status(400).json({
      error: "Path query parameter is required and must be a string.",
    });
    return;
  }

  const absolutePath = path.resolve(process.cwd(), relativePath);

  try {
    // Check if the path exists
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: "Path not found." });
    }

    // Function to get directory structure
    const getDirectoryStructure = (
      dirPath: string,
      prefix: string = ""
    ): string => {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      return entries
        .filter((entry) => !EXCLUDED_FILES_AND_FOLDERS.includes(entry.name)) // Exclude unwanted files/folders
        .map((entry) => {
          const fullPath = path.join(dirPath, entry.name);
          if (entry.isDirectory()) {
            const subStructure = getDirectoryStructure(fullPath, prefix + "  ");
            return `${prefix}- **${entry.name}/**\n${subStructure}`;
          } else {
            return `${prefix}- ${entry.name}`;
          }
        })
        .join("\n");
    };

    const markdownContent = `# File Structure of \`${relativePath}\`\n\n${getDirectoryStructure(
      absolutePath
    )}`;

    res.status(200).send(markdownContent);
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to retrieve file structure.",
      details: error.message,
    });
  }
}
