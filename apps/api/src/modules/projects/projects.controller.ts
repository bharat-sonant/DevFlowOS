import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ProjectsControllerBase } from './base/projects.controller.base';
import { ProjectsService } from './projects.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateProjectsDto, UpdateProjectsDto } from '@om/shared';

@ApiBearerAuth('access-token')
@Controller('projects')
export class ProjectsController extends ProjectsControllerBase {
  constructor(protected readonly projectService : ProjectsService) {
    super(projectService);
  }

  // ✅ Add custom endpoints here

  @Post()
  async createProject(@Body() dto: CreateProjectsDto, @Req() req:any){
    const companyId = req.user.companyId;
    const userId = req.user.sub;
    const result = await this.projectService.createProject(dto, companyId, userId)
    return result;
  }

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
    const projects = await this.projectService.getAllProjects(companyId, include);

    return {
      success: true,
      data: projects,
    };
  }

  @Put(':id')
  async updateProject(@Param('id') id:string, @Body() dto: UpdateProjectsDto, @Req() req:any){
    const companyId = req.user.companyId;
    const userId = req.user.sub;

    const result = await this.projectService.updateProject(id, dto, companyId, userId)

    return result;
  }
}
