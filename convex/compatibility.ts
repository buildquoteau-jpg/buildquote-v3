import { v } from "convex/values";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { query } from "./_generated/server";

export async function getCompatibilityRuleByDriver(
  ctx: QueryCtx | MutationCtx,
  args: { systemId: string; driverValue: string }
) {
  const rule = await ctx.db
    .query("compatibilityRules")
    .withIndex("by_system_driver", (q) =>
      q.eq("systemId", args.systemId).eq("driverValue", args.driverValue)
    )
    .first();

  return rule;
}

export const getCompatibilityRule = query({
  args: {
    systemId: v.string(),
    driverValue: v.string(),
  },
  handler: async (ctx, args) => {
    return await getCompatibilityRuleByDriver(ctx, args);
  },
});
