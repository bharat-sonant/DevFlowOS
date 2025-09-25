import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

async function main() {
  const schemaDir = path.resolve("./apps/api/prisma/schema");
  const modelsDir = path.resolve("./apps/api/prisma/models");

  const baseSchemaPath = path.join(schemaDir, "schema.prisma");
  const mergedPath = path.join(schemaDir, "merged.prisma");

  console.log("🔄 Reading base schema...");
  let mergedSchema = fs.readFileSync(baseSchemaPath, "utf-8").trim();

  // Remove nestjsDto generator block for teammates
  mergedSchema = mergedSchema.replace(
    /generator\s+nestjsDto\s*{[^}]*}/g,
    ""
  );

  console.log("Adding models from:", modelsDir);
  const modelFiles = fs
    .readdirSync(modelsDir)
    .filter((f) => f.endsWith(".prisma"));

  for (const file of modelFiles) {
    const filePath = path.join(modelsDir, file);
    const content = fs.readFileSync(filePath, "utf-8").trim();
    mergedSchema += "\n\n" + content;
  }

  fs.writeFileSync(mergedPath, mergedSchema, "utf-8");
  console.log(`Merged schema written to ${mergedPath}`);

  try {
    console.log("Running prisma generate...");
    spawnSync("pnpm", ["prisma", "generate", "--schema", mergedPath], {
      stdio: "inherit",
      shell: true,
    });
    console.log("Prisma client generated successfully (DTOs untouched)");
  } finally {
    console.log("Cleaning up temporary schema...");
    fs.unlinkSync(mergedPath);
  }
}

main().catch((err) => {
  console.error("Prisma schema merge/generate failed:", err);
  process.exit(1);
});
