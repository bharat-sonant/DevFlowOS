
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { CreateProjectsDto, UpdateProjectsDto, ProjectsResponseDto } from "@om/shared";

@Injectable()
export class ProjectsServiceBase {
  constructor(protected readonly prisma: PrismaService) {}

  async create(data: CreateProjectsDto): Promise<ProjectsResponseDto> {
    const prismaData: any = { ...data };
    
    if (prismaData.hasOwnProperty("company_id")) {
      const v = prismaData["company_id"];
      if (v !== undefined && v !== null) {
        prismaData["companies"] = { connect: { id: v } };
      }
      delete prismaData["company_id"];
    }
    const created = await this.prisma.projects.create({ data: prismaData });
    return created as unknown as ProjectsResponseDto;
  }

  async findMany(): Promise<ProjectsResponseDto[]> {
    return this.prisma.projects.findMany() as unknown as ProjectsResponseDto[];
  }

  async findOne(id: string): Promise<ProjectsResponseDto | null> {
    return this.prisma.projects.findUnique({ where: { id } }) as unknown as ProjectsResponseDto;
  }

  async update(id: string, data: UpdateProjectsDto): Promise<ProjectsResponseDto> {
    const prismaData: any = { ...data };
    
    if (prismaData.hasOwnProperty("company_id")) {
      const v = prismaData["company_id"];
      if (v !== undefined && v !== null) {
        prismaData["companies"] = { connect: { id: v } };
      }
      delete prismaData["company_id"];
    }
    return this.prisma.projects.update({ where: { id }, data: prismaData }) as unknown as ProjectsResponseDto;
  }

  async remove(id: string): Promise<ProjectsResponseDto> {
    return this.prisma.projects.delete({ where: { id } }) as unknown as ProjectsResponseDto;
  }
}
