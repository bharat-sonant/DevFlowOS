
import {ApiProperty} from '@nestjs/swagger'
import {CompaniesEntity} from '../../companies/entities/companies.entity'


export class EmployeesEntity {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
})
company_id: string ;
@ApiProperty({
  type: 'string',
})
employee_code: string ;
@ApiProperty({
  type: 'string',
})
name: string ;
@ApiProperty({
  type: 'string',
})
email: string ;
@ApiProperty({
  type: 'string',
})
password: string ;
@ApiProperty({
  type: 'integer',
  format: 'int32',
})
status: number ;
@ApiProperty({
  type: 'boolean',
})
is_owner: boolean ;
@ApiProperty({
  type: 'string',
  format: 'date-time',
})
created_at: Date ;
@ApiProperty({
  type: 'string',
})
created_by: string ;
@ApiProperty({
  type: 'string',
  format: 'date-time',
  nullable: true,
})
updated_at: Date  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
updated_by: string  | null;
@ApiProperty({
  type: () => CompaniesEntity,
  required: false,
})
companies?: CompaniesEntity ;
@ApiProperty({
  type: () => EmployeesEntity,
  required: false,
})
employees_employees_created_byToemployees?: EmployeesEntity ;
@ApiProperty({
  type: () => EmployeesEntity,
  isArray: true,
  required: false,
})
other_employees_employees_created_byToemployees?: EmployeesEntity[] ;
@ApiProperty({
  type: () => EmployeesEntity,
  required: false,
  nullable: true,
})
employees_employees_updated_byToemployees?: EmployeesEntity  | null;
@ApiProperty({
  type: () => EmployeesEntity,
  isArray: true,
  required: false,
})
other_employees_employees_updated_byToemployees?: EmployeesEntity[] ;
}
