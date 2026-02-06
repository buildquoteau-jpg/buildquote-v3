// AUTO-GENERATED STUB — will be replaced by `npx convex dev` after authentication
// This file exists only to satisfy TypeScript imports before Convex is connected.

import type { Id } from "./dataModel";

type FunctionArgs = Record<string, unknown>;
type FunctionResult = unknown;

interface QueryCtx {
  db: {
    get: (id: Id<string>) => Promise<Record<string, unknown> | null>;
    query: (table: string) => {
      withIndex: (name: string, fn: (q: any) => any) => {
        first: () => Promise<Record<string, unknown> | null>;
        collect: () => Promise<Record<string, unknown>[]>;
      };
      collect: () => Promise<Record<string, unknown>[]>;
      filter: (fn: (q: any) => any) => {
        collect: () => Promise<Record<string, unknown>[]>;
      };
    };
  };
}

interface MutationCtx extends QueryCtx {
  db: QueryCtx["db"] & {
    insert: (table: string, doc: Record<string, unknown>) => Promise<Id<string>>;
    patch: (id: Id<string>, fields: Record<string, unknown>) => Promise<void>;
    delete: (id: Id<string>) => Promise<void>;
  };
}

interface FunctionDef<Args, Result> {
  args: Args;
  handler: (...args: any[]) => Promise<Result>;
}

export function query<Args extends Record<string, unknown>>(def: {
  args: Args;
  handler: (ctx: QueryCtx, args: any) => Promise<any>;
}): FunctionDef<Args, any> {
  return def as any;
}

export function mutation<Args extends Record<string, unknown>>(def: {
  args: Args;
  handler: (ctx: MutationCtx, args: any) => Promise<any>;
}): FunctionDef<Args, any> {
  return def as any;
}
