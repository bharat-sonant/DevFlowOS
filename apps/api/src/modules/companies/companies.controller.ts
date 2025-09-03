
import { Controller } from "@nestjs/common";
import { CompaniesControllerBase } from "./base/companies.controller.base";
import { CompaniesService } from "./companies.service";

@Controller("companies")
export class CompaniesController extends CompaniesControllerBase {
  constructor(protected readonly service: CompaniesService) {
    super(service);
  }
}
