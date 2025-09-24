import { ProjectsEntity } from "../../projects/entities/projects.entity";
import { UserTokensEntity } from "../../userTokens/entities/userTokens.entity";
import { CompaniesEntity } from "../../companies/entities/companies.entity";

export class UsersEntity {
  id!: string;
  company_id!: string;
  email!: string;
  username!: string | null;
  full_name!: string | null;
  password_hash!: string | null;
  is_owner!: boolean | null;
  is_active!: boolean | null;
  created_by!: string | null;
  updated_by!: string | null;
  created_at!: Date;
  updated_at!: Date;
  projects_projects_created_byTousers?: ProjectsEntity[];
  projects_projects_updated_byTousers?: ProjectsEntity[];
  user_tokens?: UserTokensEntity[];
  companies?: CompaniesEntity;
  users_users_created_byTousers?: UsersEntity | null;
  other_users_users_created_byTousers?: UsersEntity[];
  users_users_updated_byTousers?: UsersEntity | null;
  other_users_users_updated_byTousers?: UsersEntity[];
}
