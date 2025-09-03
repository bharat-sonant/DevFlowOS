// packages/shared/src/utils/omit-fields.ts
export const STANDARD_OMIT: readonly string[] = [
  "password", "hash", "salt",
  "token", "access_token", "refresh_token",
  "created_by", "updated_by", "deleted_by",
  "createdAt", "updatedAt", "deletedAt",
  "created_at", "updated_at", "deleted_at",
  "is_deleted", "isDeleted",
];
