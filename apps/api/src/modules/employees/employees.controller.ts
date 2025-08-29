
import { Controller } from "@nestjs/common";
import { EmployeesControllerBase } from "./base/employees.controller.base";
import { EmployeesService } from "./employees.service";

@Controller("employees")
export class EmployeesController extends EmployeesControllerBase {
  constructor(protected readonly service: EmployeesService) {
    super(service);
  }
}
