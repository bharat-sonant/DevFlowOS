
import { Module } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { EmployeesServiceBase } from "./base/employees.service.base";
import { EmployeesControllerBase } from "./base/employees.controller.base";
import { EmployeesService } from "./employees.service";
import { EmployeesController } from "./employees.controller";

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService, EmployeesServiceBase, PrismaService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
