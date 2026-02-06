import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// OWNS: line item CRUD
// DOES NOT DECIDE: specs, quantities, suitability (builder decides all)

const unitValidator = v.union(
  v.literal("each"),
  v.literal("pack"),
  v.literal("box"),
  v.literal("bag")
);

const sourceValidator = v.union(
  v.literal("builder_defined"),
  v.literal("ai_suggested"),
  v.literal("imported")
);

export const listByQuoteRequest = query({
  args: { quoteRequestId: v.id("quoteRequests") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lineItems")
      .withIndex("by_quoteRequest", (q) =>
        q.eq("quoteRequestId", args.quoteRequestId)
      )
      .collect();
  },
});

export const listByComponentGroup = query({
  args: { componentGroupId: v.id("componentGroups") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lineItems")
      .withIndex("by_componentGroup", (q) =>
        q.eq("componentGroupId", args.componentGroupId)
      )
      .collect();
  },
});

export const addLineItem = mutation({
  args: {
    quoteRequestId: v.id("quoteRequests"),
    componentGroupId: v.id("componentGroups"),
    isDriver: v.boolean(),
    description: v.string(),
    spec: v.optional(v.string()),
    dimensions: v.optional(v.string()),
    unit: unitValidator,
    packSize: v.optional(v.string()),
    quantity: v.number(),
    source: sourceValidator,
    originalText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("lineItems", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateLineItem = mutation({
  args: {
    lineItemId: v.id("lineItems"),
    description: v.optional(v.string()),
    spec: v.optional(v.string()),
    dimensions: v.optional(v.string()),
    unit: v.optional(unitValidator),
    packSize: v.optional(v.string()),
    quantity: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { lineItemId, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([_, val]) => val !== undefined)
    );
    await ctx.db.patch(lineItemId, filtered);
  },
});

export const removeLineItem = mutation({
  args: { lineItemId: v.id("lineItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.lineItemId);
  },
});
