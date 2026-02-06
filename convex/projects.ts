import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// OWNS: project CRUD, archiving
// DOES NOT DECIDE: RFQ content, AI suggestions, supplier selection

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

export const createProject = mutation({
  args: {
    builderId: v.id("builders"),
    name: v.string(),
    siteAddress: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("projects", {
      ...args,
      archived: false,
      createdAt: Date.now(),
    });
  },
});

export const archiveProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, { archived: true });
  },
});

export const unarchiveProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, { archived: false });
  },
});
