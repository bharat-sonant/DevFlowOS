import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ProjectsControllerBase } from './base/projects.controller.base';
import { ProjectsService } from './projects.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('projects')
export class ProjectsController extends ProjectsControllerBase {
  constructor(protected readonly service: ProjectsService) {
    super(service);
  }

  // ✅ Add custom endpoints here

  @Get()
  async getProjects(
    @Query('companyId') companyId: string,
    @Query('includeDeleted') includeDeleted?: string,
  ) {
    if (!companyId) {
      return {
        success: false,
        message: 'companyId is required',
        data: [],
      };
    }

    const include = includeDeleted === 'true';
    const projects = await this.service.getAllProjects(companyId, include);

    return {
      success: true,
      data: projects,
    };
  }
}
