
import {ApiProperty} from '@nestjs/swagger'
import {IsNotEmpty,IsOptional,IsString} from 'class-validator'




export class CreateCompaniesDto {
  @ApiProperty({
  type: 'string',
})
@IsNotEmpty()
@IsString()
code: string ;
@ApiProperty({
  type: 'string',
})
@IsNotEmpty()
@IsString()
name: string ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
@IsOptional()
@IsString()
full_name?: string  | null;
@ApiProperty({
  type: 'string',
})
@IsNotEmpty()
@IsString()
email: string ;
}
