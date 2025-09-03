import { EmployeesEntity } from "../../employees/entities/employees.entity";

export class CompaniesEntity {
  id!: string;
  code!: string;
  name!: string;
  full_name!: string | null;
  email!: string;
  created_at!: Date;
  employees?: EmployeesEntity[];
}
