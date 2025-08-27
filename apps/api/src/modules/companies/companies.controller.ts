
import { Controller } from '@nestjs/common';
import { companiesControllerBase } from './base/companies.controller.base';
import { companiesService } from './companies.service';

@Controller('companies')
export class companiesController extends companiesControllerBase {
  constructor(protected readonly service: companiesService) {
    super(service);
  }
}
