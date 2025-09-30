import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ProjectsServiceBase } from './base/projects.service.base';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProjectsDto, UpdateProjectsDto } from '@om/shared';

@Injectable()
export class ProjectsService extends ProjectsServiceBase {
  // Add custom business logic here
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async createProject(dto : CreateProjectsDto, companyId : string, userId:string){
    const existing = await this.prisma.projects.findFirst({
      where:{
        company_id: companyId,
        prefix: dto.prefix,
        name: dto.name,
      }
    })
    if (existing) {
      throw new ConflictException('Project with this prefix and name already exists in your company.');
    }

    const project = await this.prisma.projects.create({
      data:{
         company_id: companyId,
        prefix: dto.prefix,
        name: dto.name,
        description: dto.description || null,
        is_active: true,
        is_deleted: false,
        created_by: userId,
      }
    })
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
        company_id : companyId,
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

  async updateProject(id: string,
    dto: UpdateProjectsDto,
    companyId: string,
    userId: string,){
        const project = await this.prisma.projects.findUnique({
          where:{id}
        })

         if (!project) {
      throw new NotFoundException('Project not found.');
    }

    const existing = await this.prisma.projects.findFirst({
      where: {
    company_id: companyId,
    prefix: dto.prefix,
    name: dto.name,
    NOT: { id: id },
  }
    })

     if (existing) {
      throw new ConflictException('Another project with this prefix and name already exists in your company.');
    }

     const updated = await this.prisma.projects.update({
      where: { id },
      data: {
        prefix: dto.prefix,
        name: dto.name,
        description: dto.description ,
        updated_by: userId,
      },
    });

    return {
      success: true,
      data: { ...updated, displayName: `${updated.prefix}-${updated.name}` },
    };

  }
}
