import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectsServiceBase } from './base/projects.service.base';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProjectsDto, ProjectStatusAction, UpdateProjectsDto } from '@om/shared';


@Injectable()
export class ProjectsService extends ProjectsServiceBase {
  // Add custom business logic here
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async createProject(
    dto: CreateProjectsDto,
    companyId: string,
    userId: string,
  ) {
    const existing = await this.prisma.projects.findFirst({
      where: {
        company_id: companyId,
        prefix: dto.prefix,
        name: dto.name,
      },
    });
    if (existing) {
      throw new ConflictException(
        'Project with this prefix and name already exists in your company.',
      );
    }

    const project = await this.prisma.projects.create({
      data: {
        company_id: companyId,
        prefix: dto.prefix,
        name: dto.name,
        description: dto.description || null,
        is_active: true,
        is_deleted: false,
        created_by: userId,
      },
    });
    return {
      success: true,
      data: {
        ...project,
        displayName: `${project.prefix}-${project.name}`, // computed property
      },
    };
  }

  async getAllProjects(companyId: string, includeDeleted = false) {
    return this.prisma.projects.findMany({
      where: {
        company_id: companyId,
        ...(includeDeleted ? {} : { is_deleted: false }),
      },
      select: {
        id: true,
        prefix: true,
        name: true,
        description: true,
        is_active: true,
        is_deleted: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async updateProject(
    id: string,
    dto: UpdateProjectsDto,
    companyId: string,
    userId: string,
  ) {
    const project = await this.prisma.projects.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    console.log('dto', dto)

    // Only check duplicates if prefix or name is provided
  if (dto.prefix || dto.name) {
    const existing = await this.prisma.projects.findFirst({
      where: {
        company_id: companyId,
        ...(dto.prefix && { prefix: dto.prefix }),
        ...(dto.name && { name: dto.name }),
        NOT: { id: id },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Another project with this prefix and name already exists in your company.',
      );
    }
  }


    // Only update fields provided
  const updated = await this.prisma.projects.update({
    where: { id },
    data: {
      ...(dto.prefix && { prefix: dto.prefix }),
      ...(dto.name && { name: dto.name }),
      ...(dto.description && { description: dto.description }),
      updated_by: userId,
    },
  });
    return {
      success: true,
      data: { ...updated, displayName: `${updated.prefix}-${updated.name}` },
    };
  }

  async updateProjectStatus(
    id: string,
    companyId: string,
    userId: string,
    action: ProjectStatusAction,
  ) {
    const project = await this.prisma.projects.findFirst({
      where: { id, company_id:companyId },
    });

    if (!project) throw new NotFoundException('Project not found');

    switch (action) {
      case ProjectStatusAction.DELETE:
        if (project.is_deleted)
          throw new BadRequestException('Project already deleted');
        return this.prisma.projects.update({
          where: { id },
          data: { is_deleted: true, is_active: false, updated_by: userId },
        });

      case ProjectStatusAction.RESTORE:
        if (!project.is_deleted)
          throw new BadRequestException('Project is not deleted');

        return this.prisma.projects.update({
          where: { id },
          data: { is_deleted: false, is_active: true, updated_by: userId },
        });

      case ProjectStatusAction.ACTIVATE:
        if (project.is_deleted)
          throw new BadRequestException('Cannot activate deleted project');
        return this.prisma.projects.update({
          where: { id },
          data: { is_active: true, updated_by: userId },
        });

      case ProjectStatusAction.DEACTIVATE:
        if (project.is_deleted)
          throw new BadRequestException('Cannot deactivate deleted project');
        return this.prisma.projects.update({
          where: { id },
          data: { is_active: false, updated_by: userId },
        });
    }
  }
}
