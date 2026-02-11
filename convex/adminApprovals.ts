import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/rbac";

// ------------------------------------------------------------------
// Admin Review Queue — approve / reject manufacturer submissions
// ------------------------------------------------------------------

/** List all pending manufacturer systems + reference documents. */
export const listPending = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const pendingSystems = await ctx.db
      .query("manufacturerSystems")
      .withIndex("by_status", (q) => q.eq("status", "pending_review"))
      .collect();

    const pendingDocs = await ctx.db
      .query("referenceDocuments")
      .withIndex("by_status", (q) => q.eq("status", "pending_review"))
      .collect();

    // Enrich with manufacturer names for the UI
    const manufacturerIds = new Set([
      ...pendingSystems.map((s) => s.manufacturerId),
      ...pendingDocs.map((d) => d.manufacturerId),
    ]);
    const manufacturers = new Map<string, string>();
    for (const id of manufacturerIds) {
      const mfg = await ctx.db.get(id);
      if (mfg) manufacturers.set(id, mfg.name);
    }

    // Enrich systems with generic names
    const systemIds = new Set([
      ...pendingSystems.map((s) => s.systemId),
      ...pendingDocs.filter((d) => d.systemId).map((d) => d.systemId!),
    ]);
    const systemNames = new Map<string, string>();
    for (const id of systemIds) {
      const sys = await ctx.db.get(id);
      if (sys) systemNames.set(id, sys.nameGeneric);
    }

    return {
      systems: pendingSystems.map((s) => ({
        ...s,
        _manufacturerName: manufacturers.get(s.manufacturerId) ?? "Unknown",
        _systemName: systemNames.get(s.systemId) ?? "Unknown",
      })),
      documents: pendingDocs.map((d) => ({
        ...d,
        _manufacturerName: manufacturers.get(d.manufacturerId) ?? "Unknown",
        _systemName: d.systemId
          ? systemNames.get(d.systemId) ?? "Unknown"
          : null,
      })),
    };
  },
});

/** Approve a manufacturer system mapping. */
export const approveManufacturerSystem = mutation({
  args: { id: v.id("manufacturerSystems") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const mapping = await ctx.db.get(args.id);
    if (!mapping) throw new Error("System mapping not found");
    if (mapping.status !== "pending_review") {
      throw new Error("Only pending_review items can be approved");
    }
    await ctx.db.patch(args.id, {
      status: "approved",
      rejectionReason: undefined,
      updatedAt: Date.now(),
    });
  },
});

/** Reject a manufacturer system mapping with a reason. */
export const rejectManufacturerSystem = mutation({
  args: {
    id: v.id("manufacturerSystems"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const mapping = await ctx.db.get(args.id);
    if (!mapping) throw new Error("System mapping not found");
    if (mapping.status !== "pending_review") {
      throw new Error("Only pending_review items can be rejected");
    }
    await ctx.db.patch(args.id, {
      status: "rejected",
      rejectionReason: args.reason,
      updatedAt: Date.now(),
    });
  },
});

/** Approve a reference document. */
export const approveReferenceDoc = mutation({
  args: { id: v.id("referenceDocuments") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const doc = await ctx.db.get(args.id);
    if (!doc) throw new Error("Reference document not found");
    if (doc.status !== "pending_review") {
      throw new Error("Only pending_review documents can be approved");
    }
    await ctx.db.patch(args.id, {
      status: "approved",
      rejectionReason: undefined,
      updatedAt: Date.now(),
    });
  },
});

/** Reject a reference document with a reason. */
export const rejectReferenceDoc = mutation({
  args: {
    id: v.id("referenceDocuments"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const doc = await ctx.db.get(args.id);
    if (!doc) throw new Error("Reference document not found");
    if (doc.status !== "pending_review") {
      throw new Error("Only pending_review documents can be rejected");
    }
    await ctx.db.patch(args.id, {
      status: "rejected",
      rejectionReason: args.reason,
      updatedAt: Date.now(),
    });
  },
});
