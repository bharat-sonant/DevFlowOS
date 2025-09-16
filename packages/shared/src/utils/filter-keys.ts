// packages/shared/src/utils/filter-keys.ts
export const filterKeys = <T, K extends readonly string[]>(
  target: T,
  keys: K
) => {
  return keys.filter(key => key in (target as object)) as (keyof T & K[number])[];
};
