
import { Module } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { ProjectsServiceBase } from "./base/projects.service.base";
import { ProjectsControllerBase } from "./base/projects.controller.base";
import { ProjectsService } from "./projects.service";
import { ProjectsController } from "./projects.controller";

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsServiceBase, PrismaService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
