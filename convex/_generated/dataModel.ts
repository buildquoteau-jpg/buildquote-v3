// AUTO-GENERATED STUB — will be replaced by `npx convex dev` after authentication
// This file exists only to satisfy TypeScript imports before Convex is connected.

type Brand<T, B extends string> = T & { __brand: B };

export type Id<TableName extends string> = Brand<string, TableName>;

export type DataModel = Record<string, unknown>;
