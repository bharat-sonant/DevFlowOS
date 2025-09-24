export class ProjectsDto {
  id!: string;
  prefix!: string;
  name!: string;
  description!: string | null;
  is_active!: boolean;
  is_deleted!: boolean;
  created_at!: Date;
  updated_at!: Date | null;
}
