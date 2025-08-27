
import {ApiProperty} from '@nestjs/swagger'


export class EmployeesDto {
  @ApiProperty({
  type: 'string',
})
id: string ;
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
  format: 'date-time',
  nullable: true,
})
updated_at: Date  | null;
}
