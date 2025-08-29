export class EmployeesResponseDto {
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
  companies?:
    | import("D:/WeVOIS/Projects/TaskMgmt/task-management/packages/shared/src/models/companies/entities/companies.entity").CompaniesEntity
    | undefined;
  employees_employees_created_byToemployees?:
    | import("D:/WeVOIS/Projects/TaskMgmt/task-management/packages/shared/src/models/employees/entities/employees.entity").EmployeesEntity
    | undefined;
  other_employees_employees_created_byToemployees?:
    | import("D:/WeVOIS/Projects/TaskMgmt/task-management/packages/shared/src/models/employees/entities/employees.entity").EmployeesEntity[]
    | undefined;
  employees_employees_updated_byToemployees?:
    | import("D:/WeVOIS/Projects/TaskMgmt/task-management/packages/shared/src/models/employees/entities/employees.entity").EmployeesEntity
    | null
    | undefined;
  other_employees_employees_updated_byToemployees?:
    | import("D:/WeVOIS/Projects/TaskMgmt/task-management/packages/shared/src/models/employees/entities/employees.entity").EmployeesEntity[]
    | undefined;
}
