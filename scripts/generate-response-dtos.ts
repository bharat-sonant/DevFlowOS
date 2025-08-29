import { Project } from "ts-morph";
import fs from "fs";
import path from "path";

const project = new Project({
  tsConfigFilePath: "packages/shared/tsconfig.json",
});

// base folder where DTOs are generated
const baseDir = path.resolve("packages/shared/src/models");

// Step 1: Generate Response DTOs
function generateResponseDtos() {
  project.getSourceFiles().forEach((file) => {
    file.getClasses().forEach((cls) => {
      const className = cls.getName();
      if (!className) return;

      // only for "*Entity" classes
      if (!className.endsWith("Entity")) return;

      const entityName = className.replace("Entity", "");
      const responseDtoName = `${entityName}ResponseDto`;

      const dtoFilePath = path.join(
        path.dirname(file.getFilePath()),
        "..",
        "dto",
        `${entityName.toLowerCase()}.response.dto.ts`
      );

      // skip if already exists
      if (fs.existsSync(dtoFilePath)) return;

      // create a new source file for Response DTO
      const dtoFile = project.createSourceFile(dtoFilePath, "", { overwrite: true });
      const dtoClass = dtoFile.addClass({ name: responseDtoName, isExported: true });

      // copy all props
      cls.getProperties().forEach((prop) => {
        dtoClass.addProperty({
          name: prop.getName(),
          type: prop.getType().getText(),
          hasQuestionToken: prop.hasQuestionToken(),
        });
      });

      console.log(`Generated response DTO: ${dtoFilePath}`);
    });
  });
}

// Step 2: Delete all connect-*.dto.ts files
function deleteConnectDtos(dir: string) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      deleteConnectDtos(fullPath);
    } else if (file.startsWith("connect-") && file.endsWith(".dto.ts")) {
      console.log(`Removing: ${fullPath}`);
      fs.unlinkSync(fullPath);
    }
  });
}

// run steps
generateResponseDtos();
deleteConnectDtos(baseDir);

// finally save project changes
project.save().then(() => console.log("DTO generation + cleanup completed!"));
