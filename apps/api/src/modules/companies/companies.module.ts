
import { Module } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { CompaniesServiceBase } from "./base/companies.service.base";
import { CompaniesControllerBase } from "./base/companies.controller.base";
import { CompaniesService } from "./companies.service";
import { CompaniesController } from "./companies.controller";

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, CompaniesServiceBase, PrismaService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
