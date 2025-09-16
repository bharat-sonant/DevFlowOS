export class UpdateUsersDto {
  email?: string;
  username?: string;
  full_name?: string;
  password_hash?: string;
  is_owner?: boolean;
  is_active?: boolean;
}
