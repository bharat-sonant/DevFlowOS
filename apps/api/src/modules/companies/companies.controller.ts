
import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { CompaniesControllerBase } from "./base/companies.controller.base";
import { CompaniesService } from "./companies.service";

@Controller("companies")
export class CompaniesController extends CompaniesControllerBase {
  constructor(protected readonly service: CompaniesService) {
    super(service);
  }

  // ✅ Add custom endpoints here
  @Post("/auth/pre-register")
  async preRegister (@Body("email") email: string){
    const result = await this.service.preRegister(email);
    if(!result){
      throw new BadRequestException("Company could not be pre-registered.")
    }
    return result;
  }
}
