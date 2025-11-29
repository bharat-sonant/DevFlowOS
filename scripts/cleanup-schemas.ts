import * as fs from "fs";
import * as path from "path";

const modelsDir = path.resolve(__dirname, "../apps/api/prisma/schema");

function cleanupSchemas() {
  if (!fs.existsSync(modelsDir)) {
    console.error("Models directory not found:", modelsDir);
    process.exit(1);
  }

  // Find all .prisma files that are not the main schema.prisma
  const prismaFiles = fs.readdirSync(modelsDir).filter(f => f.endsWith(".prisma"));

  for (const file of prismaFiles) {
    if (file !== "schema.prisma") {
      const filePath = path.join(modelsDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`Deleting old schema file: ${filePath}`);
        fs.unlinkSync(filePath);
      }
    }
  }

  console.log("Cleanup of old schema files complete.");
}

cleanupSchemas();
