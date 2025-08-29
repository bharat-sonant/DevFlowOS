import { Module } from "@nestjs/common";
import { EmployeesServiceBase } from "./base/employees.service.base";
import { EmployeesControllerBase } from "./base/employees.controller.base";
import { PrismaService } from "../../../prisma/prisma.service";

@Module({
  controllers: [EmployeesControllerBase],
  providers: [EmployeesServiceBase, PrismaService],
  exports: [EmployeesServiceBase],
})
export class EmployeesModule {}
