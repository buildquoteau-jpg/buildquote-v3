import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// OWNS: quote request lifecycle (draft → sent)
// DOES NOT DECIDE: material specs, quantities, supplier eligibility

export const getQuoteRequest = query({
  args: { quoteRequestId: v.id("quoteRequests") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.quoteRequestId);
  },
});

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quoteRequests")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

export const listByBuilder = query({
  args: { builderId: v.id("builders") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quoteRequests")
      .withIndex("by_builder", (q) => q.eq("builderId", args.builderId))
      .collect();
  },
});

export const createDraftQuote = mutation({
  args: {
    projectId: v.id("projects"),
    builderId: v.id("builders"),
    stage: v.string(),
    customStageLabel: v.optional(v.string()),
    scopeText: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("quoteRequests", {
      projectId: args.projectId,
      builderId: args.builderId,
      stage: args.stage,
      customStageLabel: args.customStageLabel,
      scopes: [
        {
          id: crypto.randomUUID(),
          stageContext: args.stage,
          scopeText: args.scopeText,
          createdAt: now,
        },
      ],
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const addScope = mutation({
  args: {
    quoteRequestId: v.id("quoteRequests"),
    stageContext: v.optional(v.string()),
    scopeText: v.string(),
  },
  handler: async (ctx, args) => {
    const qr = await ctx.db.get(args.quoteRequestId);
    if (!qr || qr.status === "sent") {
      throw new Error("Cannot modify a sent quote request");
    }
    const newScope = {
      id: crypto.randomUUID(),
      stageContext: args.stageContext,
      scopeText: args.scopeText,
      createdAt: Date.now(),
    };
    await ctx.db.patch(args.quoteRequestId, {
      scopes: [...qr.scopes, newScope],
      updatedAt: Date.now(),
    });
    return newScope.id;
  },
});

export const updateQuoteMeta = mutation({
  args: {
    quoteRequestId: v.id("quoteRequests"),
    fulfilmentType: v.optional(
      v.union(v.literal("delivery"), v.literal("pickup"))
    ),
    deliveryDetails: v.optional(
      v.object({
        address: v.string(),
        window: v.optional(v.string()),
      })
    ),
    pickupLocation: v.optional(v.string()),
    projectStartDate: v.optional(v.number()),
    requiredByDate: v.optional(v.number()),
    supplierMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { quoteRequestId, ...updates } = args;
    const qr = await ctx.db.get(quoteRequestId);
    if (!qr || qr.status === "sent") {
      throw new Error("Cannot modify a sent quote request");
    }
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([key, val]) => {
        void key;
        return val !== undefined;
      })
    );
    await ctx.db.patch(quoteRequestId, {
      ...filtered,
      updatedAt: Date.now(),
    });
  },
});

export const lockQuoteForSend = mutation({
  args: { quoteRequestId: v.id("quoteRequests") },
  handler: async (ctx, args) => {
    const qr = await ctx.db.get(args.quoteRequestId);
    if (!qr) throw new Error("Quote request not found");
    if (qr.status === "sent") throw new Error("Already sent");
    await ctx.db.patch(args.quoteRequestId, {
      status: "sent",
      updatedAt: Date.now(),
    });
  },
});
