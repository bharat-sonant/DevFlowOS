import { CompaniesEntity } from "../../companies/entities/companies.entity";

export class EmployeesEntity {
  id!: string;
  company_id!: string;
  employee_code!: string;
  name!: string;
  email!: string;
  password!: string;
  status!: number;
  is_owner!: boolean;
  created_at!: Date;
  created_by!: string;
  updated_at!: Date | null;
  updated_by!: string | null;
  companies?: CompaniesEntity;
  employees_employees_created_byToemployees?: EmployeesEntity;
  other_employees_employees_created_byToemployees?: EmployeesEntity[];
  employees_employees_updated_byToemployees?: EmployeesEntity | null;
  other_employees_employees_updated_byToemployees?: EmployeesEntity[];
}
