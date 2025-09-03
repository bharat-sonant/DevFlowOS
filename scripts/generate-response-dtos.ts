import { Project, SourceFile, ClassDeclaration, PropertyDeclaration } from "ts-morph";
import { writeFileSync, readdirSync, statSync, unlinkSync } from "fs";
import { join, dirname } from "path";

const modelsDir = join(__dirname, "../packages/shared/src/models");

const project = new Project({
  tsConfigFilePath: "packages/shared/tsconfig.json", // ensure this file exists or adjust path
});

// path to your shared omit-fields file
const OMIT_IMPORT_PATH = "@shared/utils/omit-fields";

function generateResponseDtos() {
  const project = new Project();
  project.addSourceFilesAtPaths(`${modelsDir}/**/entities/*.ts`);

  project.getSourceFiles().forEach((file: SourceFile) => {
    file.getClasses().forEach((cls: ClassDeclaration) => {
      const entityName = cls.getName();
      if (!entityName) return;

      const baseName = entityName.replace(/Entity$/, "");
      const responseDtoName = `${baseName}ResponseDto`;

      // 🔹 Collect relation fields dynamically
      const relationFields: string[] = [];
      cls.getProperties().forEach((prop: PropertyDeclaration) => {
        const typeNode = prop.getTypeNode();
        if (!typeNode) return;

        const text = typeNode.getText();
        if (text.endsWith("Entity") || text.includes("Entity[]")) {
          relationFields.push(prop.getName());
        }
      });

      // 🔹 Deduplicate relation fields against STANDARD_OMIT
      const uniqueRelations = Array.from(new Set(relationFields));

      const dtoFilePath = file.getFilePath()
        .replace("/entities/", "/dto/")
        .replace(".entity.ts", ".response.dto.ts");

      const content = `import { OmitType } from '@nestjs/mapped-types';
import { ${entityName} } from '../entities/${baseName.toLowerCase()}.entity';
import { STANDARD_OMIT } from '${OMIT_IMPORT_PATH}';

export class ${responseDtoName} extends OmitType(
  ${entityName} as any,
  [...STANDARD_OMIT${uniqueRelations.length ? `, ${uniqueRelations.map(f => `"${f}"`).join(", ")}` : ""}] as const
) {}
`;

      writeFileSync(dtoFilePath, content, { flag: "w" });
      console.log(`Generated ${responseDtoName}`);
    });
  });
}

// --- Delete all connect-*.dto.ts
function deleteConnectDtos(dir: string) {
  readdirSync(dir).forEach((file) => {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      deleteConnectDtos(fullPath);
    } else if (file.startsWith("connect-") && file.endsWith(".dto.ts")) {
      console.log(`Removing: ${fullPath}`);
      unlinkSync(fullPath);
    }
  });
}

// --- Run everything
generateResponseDtos();
deleteConnectDtos(modelsDir);

project.save().then(() => console.log("DTO generation + cleanup completed!"));
