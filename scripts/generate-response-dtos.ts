import {
  Project,
  SourceFile,
  ClassDeclaration,
  PropertyDeclaration,
  VariableDeclarationKind,
  Node,
  SyntaxKind,
  AsExpression,
} from "ts-morph";
import { readdirSync, statSync, unlinkSync } from "fs";
import { join } from "path";
import * as fs from "fs";

const modelsDir = join(__dirname, "../packages/shared/src/models");
const FILTER_IMPORT_PATH = "@om/shared";
const SHARED_DIR = join(__dirname, "../packages/shared/src");

const project = new Project({
  tsConfigFilePath: "packages/shared/tsconfig.json",
});

function getStandardOmitKeys(): string[] {
  const omitFilePath = join(SHARED_DIR, "utils/omit-fields.ts");
  const omitFile = project.addSourceFileAtPath(omitFilePath);
  const omitDeclaration =
    omitFile.getVariableDeclarationOrThrow("STANDARD_OMIT");

  const initializer = omitDeclaration.getInitializerOrThrow();
  let arrayInitializer: Node;

  if (Node.isAsExpression(initializer)) {
    arrayInitializer = initializer.getExpression();
  } else {
    arrayInitializer = initializer;
  }

  if (!Node.isArrayLiteralExpression(arrayInitializer)) {
    throw new Error("Expected STANDARD_OMIT to be an array literal.");
  }

  const elements = arrayInitializer.getElements();

  return elements.map((element) => {
    if (Node.isStringLiteral(element)) {
      return element.getLiteralValue();
    }
    throw new Error("STANDARD_OMIT must contain only string literals.");
  });
}

function generateResponseDtos() {
  console.log('Generating Reponse DTOs....');
  
    if (!fs.existsSync(modelsDir)) {
      // Create the new base folder
      fs.mkdirSync(modelsDir, { recursive: true });
    }

  project.addSourceFilesAtPaths(`${modelsDir}/**/entities/*.ts`);

  const standardOmitKeys = getStandardOmitKeys();

  project.getSourceFiles().forEach((file: SourceFile) => {
    file.getClasses().forEach((cls: ClassDeclaration) => {
      const entityName = cls.getName();
      console.log("entityName: ", entityName);
      if (!entityName || !entityName.endsWith("Entity")) {
        return;
      }

      const baseName = entityName.replace(/Entity$/, "");
      const responseDtoName = `${baseName}ResponseDto`;
      const dtoFilePath = file
        .getFilePath()
        .replace("/entities/", "/dto/")
        .replace(".entity.ts", ".response.dto.ts");

        console.log("baseName: ", baseName);
        console.log("responseDtoName: ", responseDtoName);
        console.log("dtoFilePath: ", dtoFilePath);

      const relationFields: string[] = [];
      cls.getProperties().forEach((prop: PropertyDeclaration) => {
        const typeNode = prop.getTypeNode();
        if (!typeNode) return;

        const text = typeNode.getText();
        if (text.endsWith("Entity") || text.includes("Entity[]")) {
          relationFields.push(prop.getName());
        }
      });
      const uniqueRelations = Array.from(new Set(relationFields));

      const dtoFile = project.createSourceFile(dtoFilePath, "", {
        overwrite: true,
      });
      dtoFile.removeText();

      dtoFile.addImportDeclaration({
        namedImports: ["OmitType"],
        moduleSpecifier: "@nestjs/mapped-types",
      });
      dtoFile.addImportDeclaration({
        namedImports: ["filterKeys"],
        moduleSpecifier: FILTER_IMPORT_PATH,
      });

      dtoFile.addImportDeclaration({
        namedImports: [entityName],
        moduleSpecifier: `../entities/${file.getBaseNameWithoutExtension()}`,
      });

      const allOmitKeysParts = [...standardOmitKeys, ...uniqueRelations];
      const allOmitKeysInitializer = `[${allOmitKeysParts.map((f) => `"${f}"`).join(", ")}] as const;`;

      dtoFile.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
          {
            name: "allOmitKeys",
            initializer: allOmitKeysInitializer,
          },
        ],
        leadingTrivia: (writer) =>
          writer
            .newLine()
            .writeLine("// The full list of keys to attempt to omit")
            .newLine(),
      });

      dtoFile.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
          {
            name: "validOmitKeys",
            initializer: `filterKeys(new ${entityName}(), allOmitKeys)`,
          },
        ],
        leadingTrivia: (writer) =>
          writer
            .newLine()
            .writeLine(
              "// Create a new, filtered list of keys that only contains keys that actually exist on the target entity"
            )
            .newLine(),
      });

      // Re-introduce `as any` to cast the dynamic key list
      dtoFile.addClass({
        name: responseDtoName,
        isExported: true,
        extends: `OmitType(${entityName} as any, validOmitKeys as any)`,
      });

      console.log(`Generated ${responseDtoName}`);
    });
  });

  return project.save();
}

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

generateResponseDtos().then(() => {
  console.log("modelsDir: ", modelsDir);
  deleteConnectDtos(modelsDir);
  console.log("DTO generation + cleanup completed!");
});
