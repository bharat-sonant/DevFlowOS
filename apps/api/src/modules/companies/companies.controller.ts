
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from "@nestjs/common";
import { CompaniesControllerBase } from "./base/companies.controller.base";
import { CompaniesService } from "./companies.service";

@Controller("companies")
export class CompaniesController extends CompaniesControllerBase {
  constructor(protected readonly service: CompaniesService) {
    super(service);
  }

@Get("check-code/:code")
async checkCode(
  @Param("code") code: string,
  @Query("excludeId") excludeId?: string,
) {
  const available = await this.service.isCodeAvailable(code, excludeId);
  return { available };
}

}
