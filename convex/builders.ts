import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// OWNS: builder account CRUD
// DOES NOT DECIDE: auth, permissions, AI behaviour

export const getOrCreateCurrentBuilder = mutation({
args: {},
handler: async (ctx) => {
const identity = await ctx.auth.getUserIdentity();
if (!identity) throw new Error("Not authenticated");

const clerkUserId = identity.subject; // stable per Clerk user
const email =
identity.email?.trim().toLowerCase() ??
(identity.tokenIdentifier?.includes("|")
? identity.tokenIdentifier.split("|").pop()!.toLowerCase()
: "");

const existing = await ctx.db
.query("builders")
.withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
.first();

if (existing) return existing;

// Defaults: only used until the builder completes profile
const firstName = (identity.givenName || "Builder").trim();
const lastName = (identity.familyName || "User").trim();
const companyName = "BuildQuote Builder";

const builderId = await ctx.db.insert("builders", {
clerkUserId,
email,
firstName,
lastName,
companyName,
profileComplete: false,
createdAt: Date.now(),
});

return await ctx.db.get(builderId);
},
});

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

export const getBuilderByClerkUserId = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("builders")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();
  },
});

export const createBuilder = mutation({
  args: {
    clerkUserId: v.optional(v.string()),
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
    clerkUserId: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    companyName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    if (!email) {
      throw new Error("Email is required");
    }

    // Prefer clerkUserId lookup if available, fall back to email
    let existing = null;
    if (args.clerkUserId) {
      existing = await ctx.db
        .query("builders")
        .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", args.clerkUserId))
        .first();
    }
    if (!existing) {
      existing = await ctx.db
        .query("builders")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();
    }

    const firstName = args.firstName?.trim() || "Builder";
    const lastName = args.lastName?.trim() || "User";
    const companyName = args.companyName?.trim() || "BuildQuote Builder";

    if (existing) {
      const patch: Record<string, unknown> = {
        firstName: existing.firstName || firstName,
        lastName: existing.lastName || lastName,
        companyName: existing.companyName || companyName,
      };
      // Always stamp clerkUserId if provided and not already set
      if (args.clerkUserId && !existing.clerkUserId) {
        patch.clerkUserId = args.clerkUserId;
      }
      await ctx.db.patch(existing._id, patch);
      return existing._id;
    }

    return await ctx.db.insert("builders", {
      clerkUserId: args.clerkUserId,
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
    businessEmail: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    abn: v.optional(v.string()),
    acn: v.optional(v.string()),
    profileComplete: v.optional(v.boolean()),
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
