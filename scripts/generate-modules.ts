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
  // ---------- Base Service ----------
  const baseService = `
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { Create${modelName}Dto, Update${modelName}Dto, ${modelName}ResponseDto } from "@om/shared";

@Injectable()
export class ${modelName}ServiceBase {
  constructor(protected readonly prisma: PrismaService) {}

  async create(data: Create${modelName}Dto): Promise<${modelName}ResponseDto> {
    const created = await this.prisma.${modelFileName}.create({ data });
    return created as unknown as ${modelName}ResponseDto;
  }

  async findMany(): Promise<${modelName}ResponseDto[]> {
    return this.prisma.${modelFileName}.findMany() as unknown as ${modelName}ResponseDto[];
  }

  async findOne(id: ${idType}): Promise<${modelName}ResponseDto | null> {
    return this.prisma.${modelFileName}.findUnique({ where: { id } }) as unknown as ${modelName}ResponseDto;
  }

  async update(id: ${idType}, data: Update${modelName}Dto): Promise<${modelName}ResponseDto> {
    return this.prisma.${modelFileName}.update({ where: { id }, data }) as unknown as ${modelName}ResponseDto;
  }

  async remove(id: ${idType}): Promise<${modelName}ResponseDto> {
    return this.prisma.${modelFileName}.delete({ where: { id } }) as unknown as ${modelName}ResponseDto;
  }
}
`;
  fs.writeFileSync(path.join(baseFolder, `${modelFileName}.service.base.ts`), baseService);

  // ---------- Base Controller ----------
  const baseController = `
import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common";
import { ${modelName}ServiceBase } from "./${modelFileName}.service.base";
import { Create${modelName}Dto, Update${modelName}Dto, ${modelName}ResponseDto } from "@om/shared";

@Controller("${modelFileName}")
export class ${modelName}ControllerBase {
  constructor(protected readonly service: ${modelName}ServiceBase) {}

  @Post()
  async create(@Body() data: Create${modelName}Dto): Promise<${modelName}ResponseDto> {
    return this.service.create(data);
  }

  @Get()
  async findMany(): Promise<${modelName}ResponseDto[]> {
    return this.service.findMany();
  }

  @Get(":id")
  async findOne(@Param("id") id: ${idType}): Promise<${modelName}ResponseDto | null> {
    return this.service.findOne(id);
  }

  @Put(":id")
  async update(@Param("id") id: ${idType}, @Body() data: Update${modelName}Dto): Promise<${modelName}ResponseDto> {
    return this.service.update(id, data);
  }

  @Delete(":id")
  async remove(@Param("id") id: ${idType}): Promise<${modelName}ResponseDto> {
    return this.service.remove(id);
  }
}
`;
  fs.writeFileSync(path.join(baseFolder, `${modelFileName}.controller.base.ts`), baseController);

  // ---------- Extended Service ----------
const servicePath = path.join(folder, `${modelFileName}.service.ts`);
if (!fs.existsSync(servicePath)) {
  const service = `
import { Injectable } from "@nestjs/common";
import { ${modelName}ServiceBase } from "./base/${modelFileName}.service.base";

@Injectable()
export class ${modelName}Service extends ${modelName}ServiceBase {
  // Add custom business logic here
}
`;
  fs.writeFileSync(servicePath, service);
}

  // ---------- Extended Controller ----------
const controllerPath = path.join(folder, `${modelFileName}.controller.ts`);
if (!fs.existsSync(controllerPath)) {
  const controller = `
import { Controller } from "@nestjs/common";
import { ${modelName}ControllerBase } from "./base/${modelFileName}.controller.base";
import { ${modelName}Service } from "./${modelFileName}.service";

@Controller("${modelFileName}")
export class ${modelName}Controller extends ${modelName}ControllerBase {
  constructor(protected readonly service: ${modelName}Service) {
    super(service);
  }

  // ✅ Add custom endpoints here
}
`;
  fs.writeFileSync(controllerPath, controller);
}

  // ---------- Module ----------
  const moduleContent = `
import { Module } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { ${modelName}ServiceBase } from "./base/${modelFileName}.service.base";
import { ${modelName}ControllerBase } from "./base/${modelFileName}.controller.base";
import { ${modelName}Service } from "./${modelFileName}.service";
import { ${modelName}Controller } from "./${modelFileName}.controller";

@Module({
  controllers: [${modelName}Controller],
  providers: [${modelName}Service, ${modelName}ServiceBase, PrismaService],
  exports: [${modelName}Service],
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

      console.log(`Generating module for model: ${modelName} from ${file}`);

      const folder = path.resolve(modulesRoot, modelFileName);
      const baseFolder = path.join(folder, "base");
      fs.mkdirSync(baseFolder, { recursive: true });

      generateFiles(modelName, modelFileName, idType, baseFolder, folder);
    }
  }

  console.log("All modules generated with base + extended structure.");
}

main();
