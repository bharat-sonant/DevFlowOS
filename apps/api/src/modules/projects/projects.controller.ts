
import { Controller } from "@nestjs/common";
import { ProjectsControllerBase } from "./base/projects.controller.base";
import { ProjectsService } from "./projects.service";
import { ApiBearerAuth } from "@nestjs/swagger";

@ApiBearerAuth('access-token')
@Controller("projects")
export class ProjectsController extends ProjectsControllerBase {
  constructor(protected readonly service: ProjectsService) {
    super(service);
  }

  // ✅ Add custom endpoints here
}
