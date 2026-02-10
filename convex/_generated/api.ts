// AUTO-GENERATED STUB — will be replaced by `npx convex dev` after authentication
// This file exists only to satisfy TypeScript imports before Convex is connected.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyApi = Record<string, Record<string, any>>;

export const api: AnyApi = new Proxy(
  {},
  {
    get(_target, module: string) {
      return new Proxy(
        {},
        {
          get(_t, fn: string) {
            return `${module}:${fn}`;
          },
        }
      );
    },
  }
);
