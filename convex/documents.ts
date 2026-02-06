import { v } from "convex/values";
import { query } from "./_generated/server";

// OWNS: document listing (read-only reference material)
// DOES NOT DECIDE: compliance, suitability — never mandatory

export const listDocuments = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("documents").collect();
  },
});

export const listByType = query({
  args: {
    type: v.union(
      v.literal("installation"),
      v.literal("tech_data"),
      v.literal("span_table")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .collect();
  },
});

export const listByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("documents").collect();
    return all.filter((d) => d.relatedCategory === args.category);
  },
});
