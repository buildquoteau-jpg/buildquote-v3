import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// OWNS: component group CRUD, ordering, toggle
// DOES NOT DECIDE: which groups to include (builder decides)

export const listByQuoteRequest = query({
  args: { quoteRequestId: v.id("quoteRequests") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("componentGroups")
      .withIndex("by_quoteRequest", (q) =>
        q.eq("quoteRequestId", args.quoteRequestId)
      )
      .collect();
  },
});

export const createSuggestedGroups = mutation({
  args: {
    quoteRequestId: v.id("quoteRequests"),
    groups: v.array(
      v.object({
        name: v.string(),
        source: v.union(v.literal("ai_suggested"), v.literal("builder_added")),
      })
    ),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (let i = 0; i < args.groups.length; i++) {
      const id = await ctx.db.insert("componentGroups", {
        quoteRequestId: args.quoteRequestId,
        name: args.groups[i].name,
        source: args.groups[i].source,
        included: true,
        orderIndex: i,
      });
      ids.push(id);
    }
    return ids;
  },
});

export const addGroup = mutation({
  args: {
    quoteRequestId: v.id("quoteRequests"),
    name: v.string(),
    orderIndex: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("componentGroups", {
      quoteRequestId: args.quoteRequestId,
      name: args.name,
      source: "builder_added",
      included: true,
      orderIndex: args.orderIndex,
    });
  },
});

export const toggleGroupIncluded = mutation({
  args: {
    groupId: v.id("componentGroups"),
    included: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.groupId, { included: args.included });
  },
});

export const reorderGroups = mutation({
  args: {
    updates: v.array(
      v.object({
        groupId: v.id("componentGroups"),
        orderIndex: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const update of args.updates) {
      await ctx.db.patch(update.groupId, { orderIndex: update.orderIndex });
    }
  },
});
