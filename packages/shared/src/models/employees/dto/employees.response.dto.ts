import { OmitType } from "@nestjs/mapped-types";
import { EmployeesEntity } from "../entities/employees.entity";
import { STANDARD_OMIT } from "@shared/utils/omit-fields";

export class EmployeesResponseDto extends OmitType(
  EmployeesEntity as any,
  [
    ...STANDARD_OMIT,
    "companies",
    "employees_employees_created_byToemployees",
    "other_employees_employees_created_byToemployees",
    "other_employees_employees_updated_byToemployees",
  ] as const,
) {}
