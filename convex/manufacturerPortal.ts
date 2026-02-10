import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  requireManufacturerUser,
  assertManufacturerRole,
} from "./lib/rbac";

// ------------------------------------------------------------------
// Manufacturer Portal — queries & mutations
// Manufacturers can ONLY access their own data.
// ------------------------------------------------------------------

// ── Queries ──────────────────────────────────────────────────────

/** Return the manufacturer record for the current user. */
export const myManufacturer = query({
  args: {},
  handler: async (ctx) => {
    const { manufacturer } = await requireManufacturerUser(ctx);
    return manufacturer;
  },
});

/** List this manufacturer's system mappings, optionally filtered by status. */
export const listMySystemMappings = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("pending_review"),
        v.literal("approved"),
        v.literal("rejected")
      )
    ),
  },
  handler: async (ctx, args) => {
    const { manufacturer } = await requireManufacturerUser(ctx);
    let q = ctx.db
      .query("manufacturerSystems")
      .withIndex("by_manufacturer", (q) =>
        q.eq("manufacturerId", manufacturer._id)
      );

    const results = await q.collect();

    if (args.status) {
      return results.filter((r) => r.status === args.status);
    }
    return results;
  },
});

/** List this manufacturer's reference documents, optionally filtered by status. */
export const listMyDocuments = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("pending_review"),
        v.literal("approved"),
        v.literal("rejected")
      )
    ),
  },
  handler: async (ctx, args) => {
    const { manufacturer } = await requireManufacturerUser(ctx);
    const results = await ctx.db
      .query("referenceDocuments")
      .withIndex("by_manufacturer", (q) =>
        q.eq("manufacturerId", manufacturer._id)
      )
      .collect();

    if (args.status) {
      return results.filter((r) => r.status === args.status);
    }
    return results;
  },
});

/** List all globally approved systems (for manufacturers to map against). */
export const listApprovedGlobalSystems = query({
  args: {},
  handler: async (ctx) => {
    await requireManufacturerUser(ctx);
    return await ctx.db
      .query("systems")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .collect();
  },
});

/** List approved components for a given system (via systemComponents join). */
export const listApprovedComponentsForSystem = query({
  args: { systemId: v.id("systems") },
  handler: async (ctx, args) => {
    await requireManufacturerUser(ctx);
    const links = await ctx.db
      .query("systemComponents")
      .withIndex("by_system_order", (q) => q.eq("systemId", args.systemId))
      .collect();

    const components = await Promise.all(
      links.map(async (link) => {
        const comp = await ctx.db.get(link.componentId);
        return comp ? { ...comp, _link: link } : null;
      })
    );
    return components.filter(Boolean);
  },
});

// ── Mutations ────────────────────────────────────────────────────

/** Create a draft system mapping (manufacturer → global system). */
export const createSystemMappingDraft = mutation({
  args: {
    systemId: v.id("systems"),
    marketedName: v.string(),
    isPrimarySupplier: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { manufacturer } = await assertManufacturerRole(ctx, [
      "admin",
      "editor",
    ]);
    const now = Date.now();
    return await ctx.db.insert("manufacturerSystems", {
      manufacturerId: manufacturer._id,
      systemId: args.systemId,
      marketedName: args.marketedName,
      isPrimarySupplier: args.isPrimarySupplier,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
  },
});

/** Update a draft system mapping (only if still in draft status). */
export const updateSystemMappingDraft = mutation({
  args: {
    manufacturerSystemId: v.id("manufacturerSystems"),
    marketedName: v.optional(v.string()),
    isPrimarySupplier: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { manufacturer } = await assertManufacturerRole(ctx, [
      "admin",
      "editor",
    ]);
    const mapping = await ctx.db.get(args.manufacturerSystemId);
    if (!mapping) throw new Error("System mapping not found");
    if (mapping.manufacturerId !== manufacturer._id) {
      throw new Error("Not your system mapping");
    }
    if (mapping.status !== "draft" && mapping.status !== "rejected") {
      throw new Error("Can only edit draft or rejected mappings");
    }

    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.marketedName !== undefined)
      updates.marketedName = args.marketedName;
    if (args.isPrimarySupplier !== undefined)
      updates.isPrimarySupplier = args.isPrimarySupplier;
    if (mapping.status === "rejected") {
      updates.status = "draft";
      updates.rejectionReason = undefined;
    }

    await ctx.db.patch(args.manufacturerSystemId, updates);
  },
});

/** Submit a draft system mapping for admin review. */
export const submitSystemMappingForReview = mutation({
  args: { manufacturerSystemId: v.id("manufacturerSystems") },
  handler: async (ctx, args) => {
    const { manufacturer } = await assertManufacturerRole(ctx, [
      "admin",
      "editor",
    ]);
    const mapping = await ctx.db.get(args.manufacturerSystemId);
    if (!mapping) throw new Error("System mapping not found");
    if (mapping.manufacturerId !== manufacturer._id) {
      throw new Error("Not your system mapping");
    }
    if (mapping.status !== "draft") {
      throw new Error("Only draft mappings can be submitted for review");
    }
    await ctx.db.patch(args.manufacturerSystemId, {
      status: "pending_review",
      updatedAt: Date.now(),
    });
  },
});

/** Create a draft reference document record. */
export const createReferenceDocDraft = mutation({
  args: {
    systemId: v.optional(v.id("systems")),
    componentId: v.optional(v.id("components")),
    docType: v.union(
      v.literal("installation"),
      v.literal("technical"),
      v.literal("span_table"),
      v.literal("standard")
    ),
    source: v.union(v.literal("manufacturer_pdf"), v.literal("standard")),
    title: v.string(),
    version: v.optional(v.string()),
    r2Key: v.string(),
  },
  handler: async (ctx, args) => {
    const { manufacturer } = await assertManufacturerRole(ctx, [
      "admin",
      "editor",
    ]);
    const now = Date.now();
    return await ctx.db.insert("referenceDocuments", {
      manufacturerId: manufacturer._id,
      systemId: args.systemId,
      componentId: args.componentId,
      docType: args.docType,
      source: args.source,
      title: args.title,
      version: args.version,
      r2Key: args.r2Key,
      advisoryOnly: true,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
  },
});

/** Submit a draft reference document for admin review. */
export const submitReferenceDocForReview = mutation({
  args: { referenceDocumentId: v.id("referenceDocuments") },
  handler: async (ctx, args) => {
    const { manufacturer } = await assertManufacturerRole(ctx, [
      "admin",
      "editor",
    ]);
    const doc = await ctx.db.get(args.referenceDocumentId);
    if (!doc) throw new Error("Reference document not found");
    if (doc.manufacturerId !== manufacturer._id) {
      throw new Error("Not your document");
    }
    if (doc.status !== "draft") {
      throw new Error("Only draft documents can be submitted for review");
    }
    await ctx.db.patch(args.referenceDocumentId, {
      status: "pending_review",
      updatedAt: Date.now(),
    });
  },
});
