import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 1. builders — account owner
  builders: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    companyName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    abn: v.optional(v.string()),
    acn: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  // 2. projects — long-lived container for work
  projects: defineTable({
    builderId: v.id("builders"),
    name: v.string(),
    siteAddress: v.string(),
    archived: v.boolean(),
    createdAt: v.number(),
  }).index("by_builder", ["builderId"]),

  // 3. quoteRequests — the core RFQ record
  quoteRequests: defineTable({
    projectId: v.id("projects"),
    builderId: v.id("builders"),

    stage: v.string(),
    customStageLabel: v.optional(v.string()),

    // Multiple scopes per quote (S5.5 locked change)
    scopes: v.array(
      v.object({
        id: v.string(),
        stageContext: v.optional(v.string()),
        scopeText: v.string(),
        createdAt: v.number(),
      })
    ),

    status: v.union(v.literal("draft"), v.literal("sent")),

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

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_builder", ["builderId"])
    .index("by_status", ["status"]),

  // 4. componentGroups — logical groupings from S4
  componentGroups: defineTable({
    quoteRequestId: v.id("quoteRequests"),
    name: v.string(),
    source: v.union(v.literal("ai_suggested"), v.literal("builder_added")),
    included: v.boolean(),
    orderIndex: v.number(),
  }).index("by_quoteRequest", ["quoteRequestId"]),

  // 5. lineItems — the core of BuildQuote
  lineItems: defineTable({
    quoteRequestId: v.id("quoteRequests"),
    componentGroupId: v.id("componentGroups"),

    isDriver: v.boolean(),

    description: v.string(),
    spec: v.optional(v.string()),
    dimensions: v.optional(v.string()),

    unit: v.union(
      v.literal("each"),
      v.literal("pack"),
      v.literal("box"),
      v.literal("bag")
    ),
    packSize: v.optional(v.string()),
    quantity: v.number(),

    source: v.union(
      v.literal("builder_defined"),
      v.literal("ai_suggested"),
      v.literal("imported")
    ),
    originalText: v.optional(v.string()),

    createdAt: v.number(),
  })
    .index("by_quoteRequest", ["quoteRequestId"])
    .index("by_componentGroup", ["componentGroupId"]),

  // 6. suppliers — builder-managed contacts
  suppliers: defineTable({
    builderId: v.id("builders"),

    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),

    builderAccountRef: v.optional(v.string()),
    tradingTerms: v.optional(v.string()),
    notes: v.optional(v.string()),

    createdAt: v.number(),
  }).index("by_builder", ["builderId"]),

  // 7. supplierRFQs — tracks each send (immutable after send)
  supplierRFQs: defineTable({
    quoteRequestId: v.id("quoteRequests"),
    supplierId: v.id("suppliers"),

    sentAt: v.number(),
    status: v.union(
      v.literal("sent"),
      v.literal("will_quote"),
      v.literal("declined")
    ),

    respondedAt: v.optional(v.number()),
    declineReason: v.optional(v.string()),
  })
    .index("by_quoteRequest", ["quoteRequestId"])
    .index("by_supplier", ["supplierId"]),

  // 8. documents — reference only (installation guides, tech data)
  documents: defineTable({
    title: v.string(),
    type: v.union(
      v.literal("installation"),
      v.literal("tech_data"),
      v.literal("span_table")
    ),
    relatedCategory: v.optional(v.string()),
    fileUrl: v.string(),
  }).index("by_type", ["type"]),

  // 9. sandboxFlags — keeps sandbox behaviour isolated
  sandboxFlags: defineTable({
    projectId: v.id("projects"),
    isSandbox: v.boolean(),
  }).index("by_project", ["projectId"]),

  // 10. savedBuilderItems — reusable custom items per builder
  savedBuilderItems: defineTable({
    builderId: v.id("builders"),

    description: v.string(),
    spec: v.optional(v.string()),
    dimensions: v.optional(v.string()),

    unit: v.union(
      v.literal("each"),
      v.literal("pack"),
      v.literal("box"),
      v.literal("bag")
    ),
    packSize: v.optional(v.string()),
    defaultQuantity: v.optional(v.number()),

    createdAt: v.number(),
  }).index("by_builder", ["builderId"]),
});
