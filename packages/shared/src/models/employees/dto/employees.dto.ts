export class EmployeesDto {
  id!: string;
  employee_code!: string;
  name!: string;
  email!: string;
  password!: string;
  status!: number;
  is_owner!: boolean;
  created_at!: Date;
  updated_at!: Date | null;
}
