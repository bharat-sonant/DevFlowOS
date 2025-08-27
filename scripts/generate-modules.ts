import * as fs from "fs";
import * as path from "path";
import { paramCase } from "param-case";

const schemaPath = path.resolve(__dirname, "../apps/api/prisma/schema.prisma");
const schema = fs.readFileSync(schemaPath, "utf-8");

const modelRegex = /model\s+(\w+)\s*{([^}]*)}/g;
let match;

while ((match = modelRegex.exec(schema)) !== null) {
  const modelName = match[1];
  const fieldsBlock = match[2].trim().split("\n").map(l => l.trim());

  // detect ID field type (default string if not found)
  let idType = "string";
  for (const line of fieldsBlock) {
    if (line.startsWith("id ")) {
      if (line.includes("Int")) idType = "number";
      else if (line.includes("String")) idType = "string";
    }
  }

  console.log(`Creating ${modelName}Module...`);

  const folder = path.resolve(__dirname, `../apps/api/src/modules/${paramCase(modelName)}`);
  const baseFolder = path.join(folder, "base");
  fs.mkdirSync(baseFolder, { recursive: true });

  // ---- Base Service
  const baseService = `
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ${modelName}ServiceBase {
  constructor(protected readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.${paramCase(modelName)}.create({ data });
  }

  async findAll() {
    return this.prisma.${paramCase(modelName)}.findMany();
  }

  async findOne(id: ${idType}) {
    return this.prisma.${paramCase(modelName)}.findUnique({ where: { id } });
  }

  async update(id: ${idType}, data: any) {
    return this.prisma.${paramCase(modelName)}.update({ where: { id }, data });
  }

  async remove(id: ${idType}) {
    return this.prisma.${paramCase(modelName)}.delete({ where: { id } });
  }
}
`;
  fs.writeFileSync(path.join(baseFolder, `${paramCase(modelName)}.service.base.ts`), baseService);

  // ---- Base Controller
  const baseController = `
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ${modelName}ServiceBase } from './${paramCase(modelName)}.service.base';

@Controller('${paramCase(modelName)}')
export class ${modelName}ControllerBase {
  constructor(protected readonly service: ${modelName}ServiceBase) {}

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: ${idType}) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: ${idType}, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: ${idType}) {
    return this.service.remove(id);
  }
}
`;
  fs.writeFileSync(path.join(baseFolder, `${paramCase(modelName)}.controller.base.ts`), baseController);

  // ---- Extended Service
  const service = `
import { Injectable } from '@nestjs/common';
import { ${modelName}ServiceBase } from './base/${paramCase(modelName)}.service.base';

@Injectable()
export class ${modelName}Service extends ${modelName}ServiceBase {}
`;
  fs.writeFileSync(path.join(folder, `${paramCase(modelName)}.service.ts`), service);

  // ---- Extended Controller
  const controller = `
import { Controller } from '@nestjs/common';
import { ${modelName}ControllerBase } from './base/${paramCase(modelName)}.controller.base';
import { ${modelName}Service } from './${paramCase(modelName)}.service';

@Controller('${paramCase(modelName)}')
export class ${modelName}Controller extends ${modelName}ControllerBase {
  constructor(protected readonly service: ${modelName}Service) {
    super(service);
  }
}
`;
  fs.writeFileSync(path.join(folder, `${paramCase(modelName)}.controller.ts`), controller);

  // ---- Module
  const module = `
import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ${modelName}Service } from './${paramCase(modelName)}.service';
import { ${modelName}Controller } from './${paramCase(modelName)}.controller';
import { ${modelName}ServiceBase } from './base/${paramCase(modelName)}.service.base';

@Module({
  providers: [${modelName}Service, ${modelName}ServiceBase, PrismaService],
  controllers: [${modelName}Controller],
})
export class ${modelName}Module {}
`;
  fs.writeFileSync(path.join(folder, `${paramCase(modelName)}.module.ts`), module);

  console.log(`${modelName}Module created successfully.`);
}

console.log("All modules generated.");
