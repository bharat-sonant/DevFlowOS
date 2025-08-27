
import {ApiProperty} from '@nestjs/swagger'
import {EmployeesEntity} from '../../employees/entities/employees.entity'


export class CompaniesEntity {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
})
code: string ;
@ApiProperty({
  type: 'string',
})
name: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
full_name: string  | null;
@ApiProperty({
  type: 'string',
})
email: string ;
@ApiProperty({
  type: 'string',
  format: 'date-time',
})
created_at: Date ;
@ApiProperty({
  type: () => EmployeesEntity,
  isArray: true,
  required: false,
})
employees?: EmployeesEntity[] ;
}
