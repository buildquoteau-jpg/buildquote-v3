import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// OWNS: builder preferences (passkey, logo, newsletter)
// Extends builders.ts without modifying it

// ── Feature 1: Passkey preference ──

export const updateAuthPreference = mutation({
  args: {
    builderId: v.id("builders"),
    passkeyEnabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.builderId, {
      authPreference: { passkeyEnabled: args.passkeyEnabled },
    });
  },
});

// ── Feature 2: Builder logo ──

export const saveBuilderLogo = mutation({
  args: {
    builderId: v.id("builders"),
    logoR2Key: v.string(),
    logoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.builderId, {
      logoR2Key: args.logoR2Key,
      logoUrl: args.logoUrl,
    });
  },
});

export const removeBuilderLogo = mutation({
  args: { builderId: v.id("builders") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.builderId, {
      logoR2Key: undefined,
      logoUrl: undefined,
    });
  },
});

// ── Feature 3: Project image ──

export const saveProjectImage = mutation({
  args: {
    projectId: v.id("projects"),
    imageR2Key: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, {
      imageR2Key: args.imageR2Key,
      imageUrl: args.imageUrl,
    });
  },
});

export const removeProjectImage = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, {
      imageR2Key: undefined,
      imageUrl: undefined,
    });
  },
});

// ── Feature 4: Newsletter opt-in ──

export const updateMarketingOptIn = mutation({
  args: {
    builderId: v.id("builders"),
    optIn: v.boolean(),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = {
      marketingOptIn: args.optIn,
    };
    if (args.optIn) {
      updates.marketingOptInAt = Date.now();
    }
    await ctx.db.patch(args.builderId, updates);
  },
});

export const listMarketingSubscribers = query({
  args: {},
  handler: async (ctx) => {
    // Admin-only: gated by ADMIN_EMAILS env var
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const email = identity.email ?? identity.tokenIdentifier;
    const adminEmails = (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e: string) => e.trim().toLowerCase())
      .filter(Boolean);
    if (!adminEmails.includes(email.toLowerCase())) {
      throw new Error("Not an admin");
    }

    const all = await ctx.db.query("builders").collect();
    return all
      .filter((b: any) => b.marketingOptIn === true)
      .map((b: any) => ({
        email: b.email,
        name: `${b.firstName} ${b.lastName}`,
        companyName: b.companyName,
        optedInAt: b.marketingOptInAt,
      }));
  },
});
