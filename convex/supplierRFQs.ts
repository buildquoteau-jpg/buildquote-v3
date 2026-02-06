import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// OWNS: RFQ send tracking, supplier response recording
// DOES NOT DECIDE: when to send (builder decides), immutable after send

export const listByQuoteRequest = query({
  args: { quoteRequestId: v.id("quoteRequests") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("supplierRFQs")
      .withIndex("by_quoteRequest", (q) =>
        q.eq("quoteRequestId", args.quoteRequestId)
      )
      .collect();
  },
});

export const listBySupplier = query({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("supplierRFQs")
      .withIndex("by_supplier", (q) => q.eq("supplierId", args.supplierId))
      .collect();
  },
});

export const sendRFQ = mutation({
  args: {
    quoteRequestId: v.id("quoteRequests"),
    supplierId: v.id("suppliers"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("supplierRFQs", {
      quoteRequestId: args.quoteRequestId,
      supplierId: args.supplierId,
      sentAt: Date.now(),
      status: "sent",
    });
  },
});

export const recordSupplierResponse = mutation({
  args: {
    rfqId: v.id("supplierRFQs"),
    status: v.union(v.literal("will_quote"), v.literal("declined")),
    declineReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.rfqId, {
      status: args.status,
      respondedAt: Date.now(),
      declineReason: args.declineReason,
    });
  },
});
