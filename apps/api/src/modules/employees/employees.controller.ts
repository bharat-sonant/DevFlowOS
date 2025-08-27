
import { Controller } from '@nestjs/common';
import { employeesControllerBase } from './base/employees.controller.base';
import { employeesService } from './employees.service';

@Controller('employees')
export class employeesController extends employeesControllerBase {
  constructor(protected readonly service: employeesService) {
    super(service);
  }
}
