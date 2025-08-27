
import { Injectable } from '@nestjs/common';
import { companiesServiceBase } from './base/companies.service.base';

@Injectable()
export class companiesService extends companiesServiceBase {}
