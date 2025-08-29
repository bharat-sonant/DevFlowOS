import { OmitType } from "@nestjs/mapped-types";
import { CompaniesEntity } from "../entities/companies.entity";
import { STANDARD_OMIT } from "@shared/utils/omit-fields";

export class CompaniesResponseDto extends OmitType(
  CompaniesEntity as any,
  [...STANDARD_OMIT, "employees"] as const,
) {}
