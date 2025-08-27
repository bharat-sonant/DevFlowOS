
import {ApiExtraModels,ApiProperty} from '@nestjs/swagger'
import {IsNotEmpty,IsOptional,IsString,ValidateNested} from 'class-validator'
import {Type} from 'class-transformer'

export class EmployeesCompanyIdEmailUniqueInputDto {
    @ApiProperty({
  type: 'string',
})
@IsNotEmpty()
@IsString()
company_id: string ;
@ApiProperty({
  type: 'string',
})
@IsNotEmpty()
@IsString()
email: string ;
  }

@ApiExtraModels(EmployeesCompanyIdEmailUniqueInputDto)
export class ConnectEmployeesDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
@IsOptional()
@IsString()
id?: string ;
@ApiProperty({
  type: EmployeesCompanyIdEmailUniqueInputDto,
  required: false,
})
@IsOptional()
@ValidateNested()
@Type(() => EmployeesCompanyIdEmailUniqueInputDto)
company_id_email?: EmployeesCompanyIdEmailUniqueInputDto ;
}
