import { Controller } from '@nestjs/common';
import { CompaniesControllerBase } from './base/companies.controller.base';
import { CompaniesService } from './companies.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('companies')
@ApiBearerAuth('access-token') 
export class CompaniesController extends CompaniesControllerBase {
  constructor(protected readonly service: CompaniesService) {
    super(service);
  }

  // ✅ Add custom endpoints here
}
