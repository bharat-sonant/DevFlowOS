// apps/api/src/modules/users/dto/complete-registration.dto.ts
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CompleteRegistrationDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}
