export class CompaniesResponseDto {
  id!: string;
  code!: string;
  name!: string;
  full_name!: string | null;
  email!: string;
  created_at!: Date;
  employees?:
    | import("D:/WeVOIS/Projects/TaskMgmt/task-management/packages/shared/src/models/employees/entities/employees.entity").EmployeesEntity[]
    | undefined;
}
