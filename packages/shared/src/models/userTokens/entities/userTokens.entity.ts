import { UsersEntity } from "../../users/entities/users.entity";

export class UserTokensEntity {
  id!: string;
  user_id!: string | null;
  email!: string;
  token!: string;
  type!: string;
  is_verified!: boolean;
  used_at!: Date | null;
  expires_at!: Date;
  created_at!: Date;
  users?: UsersEntity | null;
}
