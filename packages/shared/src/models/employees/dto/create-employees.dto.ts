
import {ApiProperty} from '@nestjs/swagger'
import {IsDateString,IsNotEmpty,IsOptional,IsString} from 'class-validator'




export class CreateEmployeesDto {
  @ApiProperty({
  type: 'string',
})
@IsNotEmpty()
@IsString()
employee_code: string ;
@ApiProperty({
  type: 'string',
})
@IsNotEmpty()
@IsString()
name: string ;
@ApiProperty({
  type: 'string',
})
@IsNotEmpty()
@IsString()
email: string ;
@ApiProperty({
  type: 'string',
})
@IsNotEmpty()
@IsString()
password: string ;
@ApiProperty({
  type: 'string',
  format: 'date-time',
  required: false,
  nullable: true,
})
@IsOptional()
@IsDateString()
updated_at?: Date  | null;
}
