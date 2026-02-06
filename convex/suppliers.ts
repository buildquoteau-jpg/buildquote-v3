import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// OWNS: supplier CRUD (builder-managed contacts)
// DOES NOT DECIDE: supplier eligibility, AI never creates suppliers

export const listSuppliers = query({
  args: { builderId: v.id("builders") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("suppliers")
      .withIndex("by_builder", (q) => q.eq("builderId", args.builderId))
      .collect();
  },
});

export const getSupplier = query({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.supplierId);
  },
});

export const createSupplier = mutation({
  args: {
    builderId: v.id("builders"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    builderAccountRef: v.optional(v.string()),
    tradingTerms: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("suppliers", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateSupplier = mutation({
  args: {
    supplierId: v.id("suppliers"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    builderAccountRef: v.optional(v.string()),
    tradingTerms: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { supplierId, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([_, val]) => val !== undefined)
    );
    await ctx.db.patch(supplierId, filtered);
  },
});
