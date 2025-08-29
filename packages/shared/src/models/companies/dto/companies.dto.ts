export class CompaniesDto {
  id!: string;
  code!: string;
  name!: string;
  full_name!: string | null;
  email!: string;
  created_at!: Date;
}
