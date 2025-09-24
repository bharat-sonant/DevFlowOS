import { ProjectsEntity } from "../../projects/entities/projects.entity";
import { UsersEntity } from "../../users/entities/users.entity";

export class CompaniesEntity {
  id!: string;
  code!: string;
  name!: string;
  full_name!: string | null;
  email!: string;
  created_at!: Date;
  projects?: ProjectsEntity[];
  users?: UsersEntity[];
}
