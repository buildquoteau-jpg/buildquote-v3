import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// OWNS: project setup CRUD, archiving
// DOES NOT DECIDE: RFQ content, AI suggestions, supplier selection

const projectAddressValidator = v.object({
  formattedAddress: v.string(),
  lat: v.number(),
  lng: v.number(),
  placeId: v.string(),
});

const projectStatusValidator = v.union(v.literal("draft"), v.literal("active"));

export const listProjectsByBuilder = query({
  args: { builderId: v.id("builders") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_builder", (q) => q.eq("builderId", args.builderId))
      .collect();
  },
});

export const getProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.projectId);
  },
});

export const saveProjectSetup = mutation({
  args: {
    projectId: v.optional(v.id("projects")),
    builderId: v.id("builders"),
    name: v.string(),
    address: projectAddressValidator,
    stage: v.optional(v.string()),
    customStageLabel: v.optional(v.string()),
    builderNotes: v.string(),
    status: projectStatusValidator,
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const payload = {
      name: args.name.trim(),
      siteAddress: args.address.formattedAddress,
      siteAddressDetails: args.address,
      setupStage: args.stage,
      setupCustomStageLabel: args.customStageLabel,
      builderNotes: args.builderNotes,
      status: args.status,
      archived: false,
      updatedAt: now,
    };

    if (args.projectId) {
      const existing = await ctx.db.get(args.projectId);
      if (!existing) {
        throw new Error("Project not found");
      }
      if (existing.builderId !== args.builderId) {
        throw new Error("Cannot edit a project owned by another builder");
      }

      await ctx.db.patch(args.projectId, payload);
      return args.projectId;
    }

    return await ctx.db.insert("projects", {
      builderId: args.builderId,
      name: payload.name,
      siteAddress: payload.siteAddress,
      siteAddressDetails: payload.siteAddressDetails,
      status: payload.status,
      setupStage: payload.setupStage,
      setupCustomStageLabel: payload.setupCustomStageLabel,
      builderNotes: payload.builderNotes,
      archived: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const archiveProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, { archived: true, updatedAt: Date.now() });
  },
});

export const unarchiveProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, { archived: false, updatedAt: Date.now() });
  },
});
