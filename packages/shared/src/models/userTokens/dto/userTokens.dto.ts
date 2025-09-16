export class UserTokensDto {
  id!: string;
  email!: string;
  token!: string;
  type!: string;
  is_verified!: boolean;
  used_at!: Date | null;
  expires_at!: Date;
  created_at!: Date;
}
