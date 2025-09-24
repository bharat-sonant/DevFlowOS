import { CompaniesEntity } from "../../companies/entities/companies.entity";
import { UsersEntity } from "../../users/entities/users.entity";

export class ProjectsEntity {
  id!: string;
  company_id!: string;
  prefix!: string;
  name!: string;
  description!: string | null;
  is_active!: boolean;
  is_deleted!: boolean;
  created_by!: string | null;
  updated_by!: string | null;
  created_at!: Date;
  updated_at!: Date | null;
  companies?: CompaniesEntity;
  users_projects_created_byTousers?: UsersEntity | null;
  users_projects_updated_byTousers?: UsersEntity | null;
}
