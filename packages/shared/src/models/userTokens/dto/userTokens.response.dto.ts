import { OmitType } from "@nestjs/mapped-types";
import { filterKeys } from "@om/shared";
import { UserTokensEntity } from "../entities/userTokens.entity";

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
] as const;

// Create a new, filtered list of keys that only contains keys that actually exist on the target entity

const validOmitKeys = filterKeys(new UserTokensEntity(), allOmitKeys);

export class UserTokensResponseDto extends OmitType(
  UserTokensEntity as any,
  validOmitKeys as any,
) {}
