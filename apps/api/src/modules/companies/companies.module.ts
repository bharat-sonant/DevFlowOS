import { Module } from "@nestjs/common";
import { CompaniesServiceBase } from "./base/companies.service.base";
import { CompaniesControllerBase } from "./base/companies.controller.base";
import { PrismaService } from "../../../prisma/prisma.service";

@Module({
  controllers: [CompaniesControllerBase],
  providers: [CompaniesServiceBase, PrismaService],
  exports: [CompaniesServiceBase],
})
export class CompaniesModule {}
