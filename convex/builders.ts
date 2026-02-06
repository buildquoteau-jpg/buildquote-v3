import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// OWNS: builder account CRUD
// DOES NOT DECIDE: auth, permissions, AI behaviour

export const getBuilder = query({
  args: { builderId: v.id("builders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.builderId);
  },
});

export const getBuilderByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("builders")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const createBuilder = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    companyName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    abn: v.optional(v.string()),
    acn: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("builders", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateBuilder = mutation({
  args: {
    builderId: v.id("builders"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    companyName: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    abn: v.optional(v.string()),
    acn: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { builderId, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([_, val]) => val !== undefined)
    );
    await ctx.db.patch(builderId, filtered);
  },
});
