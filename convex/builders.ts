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
    const email = args.email.trim().toLowerCase();
    return await ctx.db
      .query("builders")
      .withIndex("by_email", (q) => q.eq("email", email))
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

export const upsertBuilderByEmail = mutation({
  args: {
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    companyName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    if (!email) {
      throw new Error("Email is required");
    }

    const existing = await ctx.db
      .query("builders")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    const firstName = args.firstName?.trim() || "Builder";
    const lastName = args.lastName?.trim() || "User";
    const companyName = args.companyName?.trim() || "BuildQuote Builder";

    if (existing) {
      await ctx.db.patch(existing._id, {
        firstName: existing.firstName || firstName,
        lastName: existing.lastName || lastName,
        companyName: existing.companyName || companyName,
      });
      return existing._id;
    }

    return await ctx.db.insert("builders", {
      firstName,
      lastName,
      companyName,
      email,
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
      Object.entries(updates).filter(([key, val]) => {
        void key;
        return val !== undefined;
      })
    );
    await ctx.db.patch(builderId, filtered);
  },
});
