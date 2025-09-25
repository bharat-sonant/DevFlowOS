import { Injectable } from '@nestjs/common';
import { ProjectsServiceBase } from './base/projects.service.base';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProjectsService extends ProjectsServiceBase {
  // Add custom business logic here
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async getAllProjects(companyId: string, includeDeleted = false) {
    return this.prisma.projects.findMany({
      where: {
        companyId,
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
}
