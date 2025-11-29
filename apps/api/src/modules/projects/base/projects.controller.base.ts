
import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common";
import { ProjectsServiceBase } from "./projects.service.base";
import { CreateProjectsDto, UpdateProjectsDto, ProjectsResponseDto } from "@om/shared";

@Controller("projects")
export class ProjectsControllerBase {
  constructor(protected readonly service: ProjectsServiceBase) {}

  @Post()
  async create(@Body() data: CreateProjectsDto): Promise<ProjectsResponseDto> {
    return this.service.create(data);
  }

  @Get()
  async findMany(): Promise<ProjectsResponseDto[]> {
    return this.service.findMany();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<ProjectsResponseDto | null> {
    return this.service.findOne(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() data: UpdateProjectsDto): Promise<ProjectsResponseDto> {
    return this.service.update(id, data);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<ProjectsResponseDto> {
    return this.service.remove(id);
  }
}
