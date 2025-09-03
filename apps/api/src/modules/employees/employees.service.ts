
import { Injectable } from "@nestjs/common";
import { EmployeesServiceBase } from "./base/employees.service.base";

@Injectable()
export class EmployeesService extends EmployeesServiceBase {}
