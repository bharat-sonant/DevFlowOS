import * as fs from "fs";
import * as path from "path";

const schemaPath = path.resolve(__dirname, "../apps/api/prisma/schema.prisma");
const modelsDir = path.resolve(__dirname, "../apps/api/prisma/models");

// ensure models dir exists
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

const schemaContent = fs.readFileSync(schemaPath, "utf-8");

// match all model blocks
const modelRegex = /model\s+\w+\s+{[^}]+}/gms;
const models = schemaContent.match(modelRegex) || [];

// write each model to its own file
models.forEach((modelBlock) => {
  const modelName = modelBlock.match(/model\s+(\w+)/)![1];
  const filePath = path.join(modelsDir, `${modelName.toLowerCase()}.prisma`);
  fs.writeFileSync(filePath, modelBlock.trim() + "\n", "utf-8");
  console.log(`Wrote ${filePath}`);
});

// clean schema.prisma (remove models, keep generators & imports)
const cleanedSchema = schemaContent.replace(modelRegex, "").trim();

const importLines = models.map((m) => {
  const name = m.match(/model\s+(\w+)/)![1];
  return `import "./models/${name.toLowerCase()}.prisma"`;
});

fs.writeFileSync(
  schemaPath,
    `${cleanedSchema}`,
//   `${cleanedSchema}\n\n${importLines.join("\n")}\n`,
  "utf-8"
);

console.log("schema.prisma updated with imports only");
