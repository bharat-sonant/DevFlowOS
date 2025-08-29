import * as fs from "fs";
import * as path from "path";
import { paramCase } from "param-case";

const modelsDir = path.resolve(__dirname, "../apps/api/prisma/models");
const modulesRoot = path.resolve(__dirname, "../apps/api/src/modules");

function pascalCase(name: string): string {
  return name.replace(/(^\w|_\w)/g, match =>
    match.replace("_", "").toUpperCase()
  );
}

function generateFiles(modelName: string, modelFileName: string, idType: string, baseFolder: string, folder: string) {
  // ---------- Service ----------
  const serviceContent = `import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { Create${modelName}Dto, Update${modelName}Dto, ${modelName}ResponseDto } from "@om/shared";

@Injectable()
export class ${modelName}ServiceBase {
  constructor(protected readonly prisma: PrismaService) {}

  async create(data: Create${modelName}Dto): Promise<${modelName}ResponseDto> {
    return this.prisma.${modelFileName}.create({ data });
  }

  async findMany(): Promise<${modelName}ResponseDto[]> {
    return this.prisma.${modelFileName}.findMany();
  }

  async findOne(id: ${idType}): Promise<${modelName}ResponseDto | null> {
    return this.prisma.${modelFileName}.findUnique({ where: { id } });
  }

  async update(id: ${idType}, data: Update${modelName}Dto): Promise<${modelName}ResponseDto> {
    return this.prisma.${modelFileName}.update({ where: { id }, data });
  }

  async remove(id: ${idType}): Promise<${modelName}ResponseDto> {
    return this.prisma.${modelFileName}.delete({ where: { id } });
  }
}
`;

  fs.writeFileSync(path.join(baseFolder, `${modelFileName}.service.base.ts`), serviceContent);

  // ---------- Controller ----------
  const controllerContent = `import { Controller, Get, Post, Body, Param, Delete, Put } from "@nestjs/common";
import { ${modelName}ServiceBase } from "./${modelFileName}.service.base";
import { Create${modelName}Dto, Update${modelName}Dto } from "@om/shared";

@Controller("${modelFileName}")
export class ${modelName}ControllerBase {
  constructor(private readonly service: ${modelName}ServiceBase) {}

  @Post()
  create(@Body() data: Create${modelName}Dto) {
    return this.service.create(data);
  }

  @Get()
  findMany() {
    return this.service.findMany();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() data: Update${modelName}Dto) {
    return this.service.update(id, data);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
`;

  fs.writeFileSync(path.join(baseFolder, `${modelFileName}.controller.base.ts`), controllerContent);

  // ---------- Module ----------
  const moduleContent = `import { Module } from "@nestjs/common";
import { ${modelName}ServiceBase } from "./base/${modelFileName}.service.base";
import { ${modelName}ControllerBase } from "./base/${modelFileName}.controller.base";
import { PrismaService } from "../../../prisma/prisma.service";

@Module({
  controllers: [${modelName}ControllerBase],
  providers: [${modelName}ServiceBase, PrismaService],
  exports: [${modelName}ServiceBase],
})
export class ${modelName}Module {}
`;

  fs.writeFileSync(path.join(folder, `${modelFileName}.module.ts`), moduleContent);
}

function main() {
  if (!fs.existsSync(modelsDir)) {
    console.error("Models directory not found:", modelsDir);
    process.exit(1);
  }

  const files = fs.readdirSync(modelsDir).filter(f => f.endsWith(".prisma"));

  for (const file of files) {
    const schema = fs.readFileSync(path.join(modelsDir, file), "utf-8");

    const modelRegex = /model\s+(\w+)\s*{([^}]*)}/g;
    let match;

    while ((match = modelRegex.exec(schema)) !== null) {
      const rawName = match[1];
      const modelName = pascalCase(rawName);
      const modelFileName = paramCase(rawName);

      const fieldsBlock = match[2].trim().split("\n").map(l => l.trim());
      let idType = "string";
      for (const line of fieldsBlock) {
        if (line.startsWith("id ")) {
          if (line.includes("Int")) idType = "number";
          else if (line.includes("String")) idType = "string";
        }
      }

      console.log(`⚙️ Generating module for model: ${modelName} from ${file}`);

      const folder = path.resolve(modulesRoot, modelFileName);
      const baseFolder = path.join(folder, "base");
      fs.mkdirSync(baseFolder, { recursive: true });

      generateFiles(modelName, modelFileName, idType, baseFolder, folder);
    }
  }

  console.log("All modules generated from separate .prisma files.");
}

main();
