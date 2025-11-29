export class CreateUserTokensDto {
  email!: string;
  token!: string;
  type!: string;
  used_at?: Date;
  expires_at!: Date;
}
