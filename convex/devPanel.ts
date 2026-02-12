import { mutation } from "./_generated/server";

const FALLBACK_ADMIN_EMAIL = "buildquoteau@gmail.com";

export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const callerEmail = (
      identity.email ?? identity.tokenIdentifier ?? ""
    ).toLowerCase();

    const adminEmails = new Set(
      (((globalThis as { process?: { env?: Record<string, string | undefined> } })
        .process?.env?.ADMIN_EMAILS) ?? "")
        .split(",")
        .map((email: string) => email.trim().toLowerCase())
        .filter(Boolean)
    );
    adminEmails.add(FALLBACK_ADMIN_EMAIL);

    if (!adminEmails.has(callerEmail)) {
      throw new Error("Not an admin");
    }

    const now = Date.now();

    let builder = await ctx.db
      .query("builders")
      .withIndex("by_email", (q) => q.eq("email", callerEmail))
      .first();

    if (!builder) {
      const builderId = await ctx.db.insert("builders", {
        firstName: "Dev",
        lastName: "Builder",
        companyName: "BuildQuote Demo",
        email: callerEmail,
        createdAt: now,
      });
      builder = await ctx.db.get(builderId);
      if (!builder) throw new Error("Failed to create builder");
    }

    const existingProjects = await ctx.db
      .query("projects")
      .withIndex("by_builder", (q) => q.eq("builderId", builder._id))
      .collect();

    let project =
      existingProjects.find((p) => p.name === "Dev Panel Demo Project") ?? null;

    if (!project) {
      const projectId = await ctx.db.insert("projects", {
        builderId: builder._id,
        name: "Dev Panel Demo Project",
        siteAddress: "123 Demo Street, Melbourne VIC",
        archived: false,
        createdAt: now,
      });
      project = await ctx.db.get(projectId);
      if (!project) throw new Error("Failed to create project");
    }

    const projectQuotes = await ctx.db
      .query("quoteRequests")
      .withIndex("by_project", (q) => q.eq("projectId", project._id))
      .collect();

    let quoteRequest =
      projectQuotes.find((qr) => qr.customStageLabel === "Dev Panel Seed RFQ") ??
      null;

    if (quoteRequest) {
      await ctx.db.patch(quoteRequest._id, {
        stage: "framing",
        customStageLabel: "Dev Panel Seed RFQ",
        scopes: [
          {
            id: crypto.randomUUID(),
            stageContext: "framing",
            scopeText: "Wall framing + external cladding package for visual QA.",
            createdAt: now,
          },
        ],
        status: "draft",
        updatedAt: now,
      });
      quoteRequest = await ctx.db.get(quoteRequest._id);
      if (!quoteRequest) throw new Error("Failed to update quote request");
    } else {
      const quoteRequestId = await ctx.db.insert("quoteRequests", {
        projectId: project._id,
        builderId: builder._id,
        stage: "framing",
        customStageLabel: "Dev Panel Seed RFQ",
        scopes: [
          {
            id: crypto.randomUUID(),
            stageContext: "framing",
            scopeText: "Wall framing + external cladding package for visual QA.",
            createdAt: now,
          },
        ],
        status: "draft",
        createdAt: now,
        updatedAt: now,
      });
      quoteRequest = await ctx.db.get(quoteRequestId);
      if (!quoteRequest) throw new Error("Failed to create quote request");
    }

    const existingItems = await ctx.db
      .query("lineItems")
      .withIndex("by_quoteRequest", (q) => q.eq("quoteRequestId", quoteRequest._id))
      .collect();
    for (const item of existingItems) {
      await ctx.db.delete(item._id);
    }

    const existingGroups = await ctx.db
      .query("componentGroups")
      .withIndex("by_quoteRequest", (q) => q.eq("quoteRequestId", quoteRequest._id))
      .collect();
    for (const group of existingGroups) {
      await ctx.db.delete(group._id);
    }

    const framingGroupId = await ctx.db.insert("componentGroups", {
      quoteRequestId: quoteRequest._id,
      name: "Framing Materials",
      source: "builder_added",
      included: true,
      orderIndex: 0,
    });

    const claddingGroupId = await ctx.db.insert("componentGroups", {
      quoteRequestId: quoteRequest._id,
      name: "Cladding & Fixings",
      source: "builder_added",
      included: true,
      orderIndex: 1,
    });

    const seededItems = [
      {
        componentGroupId: framingGroupId,
        isDriver: true,
        description: "MGP10 Pine Stud 90x45",
        unit: "each" as const,
        quantity: 180,
      },
      {
        componentGroupId: framingGroupId,
        isDriver: false,
        description: "LVL Beam 240x45",
        unit: "each" as const,
        quantity: 8,
      },
      {
        componentGroupId: framingGroupId,
        isDriver: false,
        description: "Structural Bracing Strap",
        unit: "pack" as const,
        quantity: 6,
      },
      {
        componentGroupId: claddingGroupId,
        isDriver: true,
        description: "Fibre Cement Cladding Board 3000x1200",
        unit: "each" as const,
        quantity: 72,
      },
      {
        componentGroupId: claddingGroupId,
        isDriver: false,
        description: "Class 3 Exterior Screws",
        unit: "box" as const,
        quantity: 12,
      },
      {
        componentGroupId: claddingGroupId,
        isDriver: false,
        description: "Weatherproof Sealant",
        unit: "bag" as const,
        quantity: 10,
      },
    ];

    for (const item of seededItems) {
      await ctx.db.insert("lineItems", {
        quoteRequestId: quoteRequest._id,
        componentGroupId: item.componentGroupId,
        isDriver: item.isDriver,
        description: item.description,
        unit: item.unit,
        quantity: item.quantity,
        source: "builder_defined",
        createdAt: now,
      });
    }

    return {
      builderId: builder._id,
      builderName: `${builder.firstName} ${builder.lastName}`,
      projectId: project._id,
      projectName: project.name,
      quoteRequestId: quoteRequest._id,
      groups: [
        { id: framingGroupId, name: "Framing Materials" },
        { id: claddingGroupId, name: "Cladding & Fixings" },
      ],
      items: seededItems.map((item) => ({
        groupName:
          item.componentGroupId === framingGroupId
            ? "Framing Materials"
            : "Cladding & Fixings",
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
      })),
    };
  },
});
