
import { Injectable } from '@nestjs/common';
import { employeesServiceBase } from './base/employees.service.base';

@Injectable()
export class employeesService extends employeesServiceBase {}
