import * as fs from "fs";
import * as path from "path";
import { paramCase } from "param-case";

const modelsDir = path.resolve(__dirname, "../apps/api/prisma/models");
const modulesRoot = path.resolve(__dirname, "../apps/api/src/modules");

function pascalCase(name: string): string {
  return name.replace(/(^\w|_\w)/g, (match) =>
    match.replace("_", "").toUpperCase()
  );
}

function generateFiles(
  modelName: string,
  modelFileName: string,
  idType: string,
  baseFolder: string,
  folder: string,
  relations: { relationField: string; relatedModel: string; fkField: string; required: boolean }[]
) {
  if (!fs.existsSync(folder)) {
    // Create the new base folder
    fs.mkdirSync(baseFolder, { recursive: true });
  }

  // Build relation mapping code to inject into create/update
  const relationMappings = relations
    .map(r => {
      // prisma relation property typically is the relationField (e.g. 'companies')
      // fkField is the actual fk column (e.g. 'company_id')
      return `
    if (prismaData.hasOwnProperty("${r.fkField}")) {
      const v = prismaData["${r.fkField}"];
      if (v !== undefined && v !== null) {
        prismaData["${r.relationField}"] = { connect: { id: v } };
      }
      delete prismaData["${r.fkField}"];
    }`;
    })
    .join("\n");

  // ---------- Base Service ----------
  const baseService = `
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { Create${modelName}Dto, Update${modelName}Dto, ${modelName}ResponseDto } from "@om/shared";

@Injectable()
export class ${modelName}ServiceBase {
  constructor(protected readonly prisma: PrismaService) {}

  async create(data: Create${modelName}Dto): Promise<${modelName}ResponseDto> {
    const prismaData: any = { ...data };
    ${relationMappings}
    const created = await this.prisma.${modelFileName}.create({ data: prismaData });
    return created as unknown as ${modelName}ResponseDto;
  }

  async findMany(): Promise<${modelName}ResponseDto[]> {
    return this.prisma.${modelFileName}.findMany() as unknown as ${modelName}ResponseDto[];
  }

  async findOne(id: ${idType}): Promise<${modelName}ResponseDto | null> {
    return this.prisma.${modelFileName}.findUnique({ where: { id } }) as unknown as ${modelName}ResponseDto;
  }

  async update(id: ${idType}, data: Update${modelName}Dto): Promise<${modelName}ResponseDto> {
    const prismaData: any = { ...data };
    ${relationMappings}
    return this.prisma.${modelFileName}.update({ where: { id }, data: prismaData }) as unknown as ${modelName}ResponseDto;
  }

  async remove(id: ${idType}): Promise<${modelName}ResponseDto> {
    return this.prisma.${modelFileName}.delete({ where: { id } }) as unknown as ${modelName}ResponseDto;
  }
}
`;
  fs.writeFileSync(
    path.join(baseFolder, `${modelFileName}.service.base.ts`),
    baseService,
    { encoding: "utf-8" }
  );

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
  fs.writeFileSync(
    path.join(baseFolder, `${modelFileName}.controller.base.ts`),
    baseController,
    { encoding: "utf-8" }
  );

  // ---------- Extended Service (only create if missing) ----------
  const servicePath = path.join(folder, `${modelFileName}.service.ts`);
  const service = `
import { Injectable } from "@nestjs/common";
import { ${modelName}ServiceBase } from "./base/${modelFileName}.service.base";

@Injectable()
export class ${modelName}Service extends ${modelName}ServiceBase {
  // Add custom business logic here
}
`;
  if (!fs.existsSync(servicePath)) {
    fs.writeFileSync(servicePath, service, { encoding: "utf-8" });
  }

  // ---------- Extended Controller (only create if missing) ----------
  const controllerPath = path.join(folder, `${modelFileName}.controller.ts`);
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
  if (!fs.existsSync(controllerPath)) {
    fs.writeFileSync(controllerPath, controller, { encoding: "utf-8" });
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
  fs.writeFileSync(
    path.join(folder, `${modelFileName}.module.ts`),
    moduleContent,
    { encoding: "utf-8" }
  );
}

function main() {
  if (!fs.existsSync(modelsDir)) {
    console.error("Models directory not found:", modelsDir);
    process.exit(1);
  }

  const files = fs.readdirSync(modelsDir).filter((f) => f.endsWith(".prisma"));

  for (const file of files) {
    const schema = fs.readFileSync(path.join(modelsDir, file), "utf-8");
    console.log("schema: ", schema);
    const modelRegex = /model\s+(\w+)\s*{([^}]*)}/g;
    let match;

    while ((match = modelRegex.exec(schema)) !== null) {
      const rawName = match[1];
      const modelName = pascalCase(rawName);
      const modelFileName = paramCase(rawName);

      console.log("rawName: ", rawName);
      console.log("modelName: ", modelName);
      console.log("modelFileName: ", modelFileName);

      const fieldsBlock = match[2]
        .trim()
        .split("\n")
        .map((l) => l.trim());
      let idType = "string";
      for (const line of fieldsBlock) {
        if (line.startsWith("id ")) {
          if (line.includes("Int")) idType = "number";
          else if (line.includes("String")) idType = "string";
        }
      }

      // ---------- relation detection ----------
      // look for lines like:
      //   companies companies @relation(fields: [company_id], references: [id])
      // then find the fk field line (company_id ...) to detect optionality
      const relations: { relationField: string; relatedModel: string; fkField: string; required: boolean }[] = [];
      for (const line of fieldsBlock) {
        const relMatch = line.match(/^(\w+)\s+(\w+)\s+@relation.*fields:\s*\[(\w+)\]/);
        if (relMatch) {
          const relationField = relMatch[1];       // e.g. "companies"
          const relatedModel = relMatch[2];        // e.g. "companies"
          const fkField = relMatch[3];             // e.g. "company_id"
          // find fk field declaration to know if optional (has '?')
          const fkLine = fieldsBlock.find((l) => l.startsWith(`${fkField} `) || l.startsWith(`${fkField}?`));
          const required = fkLine ? !fkLine.includes("?") : true;
          relations.push({ relationField, relatedModel, fkField, required });
        }
      }

      console.log(`Generating module for model: ${modelName} from ${file} (relations: ${JSON.stringify(relations)})`);

      const folder = path.resolve(modulesRoot, rawName);
      const baseFolder = path.join(folder, "base");

      generateFiles(modelName, rawName, idType, baseFolder, folder, relations);

    }
  }

  console.log("All modules generated with base + extended structure.");
}

main();
