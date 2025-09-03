import fs from "fs";
import path from "path";

const MODELS_DIR = path.resolve("packages/shared/src/models");

function walk(dir: string, callback: (file: string) => void) {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walk(dirPath, callback);
    } else if (f.endsWith(".ts")) {
      callback(path.join(dir, f));
    }
  });
}

function processFile(filePath: string) {
  let content = fs.readFileSync(filePath, "utf8");

  // 1. Remove swagger imports
  content = content.replace(
    /import\s+\{[^}]*\}\s+from\s+['"]@nestjs\/swagger['"];?\n?/g,
    ""
  );

  // 2. Remove full @ApiProperty(...) decorator blocks (single or multi-line)
  content = content.replace(/^\s*@ApiProperty\([^)]*\)\s*\n?/gm, ""); // single-line
  content = content.replace(/^\s*@ApiProperty\([^]*?\)\s*\n?/gm, ""); // multi-line

  // 3. Ensure properties have `!`
  content = content.replace(
    /^(\s*)([a-zA-Z0-9_]+)\s*:\s*([^;]+);/gm,
    (_, indent, name, type) => `${indent}${name}!: ${type};`
  );

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Cleaned ${filePath}`);
}

walk(MODELS_DIR, processFile);
