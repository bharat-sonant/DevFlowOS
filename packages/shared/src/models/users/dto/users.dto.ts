export class UsersDto {
  id!: string;
  email!: string;
  username!: string | null;
  full_name!: string | null;
  password_hash!: string | null;
  is_owner!: boolean | null;
  is_active!: boolean | null;
  created_at!: Date;
  updated_at!: Date;
}
