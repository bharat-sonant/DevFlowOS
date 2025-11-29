import { OmitType } from "@nestjs/mapped-types";
import { filterKeys } from "../../../utils/filter-keys";
import { CompaniesEntity } from "../entities/companies.entity";

// The full list of keys to attempt to omit

const allOmitKeys = [
  "password",
  "hash",
  "salt",
  "token",
  "access_token",
  "refresh_token",
  "created_by",
  "updated_by",
  "deleted_by",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "created_at",
  "updated_at",
  "deleted_at",
  "is_deleted",
  "isDeleted",
  "projects",
  "users",
] as const;

// Create a new, filtered list of keys that only contains keys that actually exist on the target entity

const validOmitKeys = filterKeys(new CompaniesEntity(), allOmitKeys);

export class CompaniesResponseDto extends OmitType(
  CompaniesEntity as any,
  validOmitKeys as any,
) {}
