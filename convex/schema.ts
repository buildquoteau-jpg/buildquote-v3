import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 1. builders — account owner
  builders: defineTable({
clerkUserId: v.optional(v.string()),

firstName: v.string(),
lastName: v.string(),
companyName: v.string(),

email: v.string(), // Clerk sign-in email
businessEmail: v.optional(v.string()), // Used for RFQs

phone: v.optional(v.string()),
address: v.optional(v.string()),
abn: v.optional(v.string()),
acn: v.optional(v.string()),

profileComplete: v.optional(v.boolean()),

authPreference: v.optional(
v.object({ passkeyEnabled: v.optional(v.boolean()) })
),

logoR2Key: v.optional(v.string()),
logoUrl: v.optional(v.string()),

marketingOptIn: v.optional(v.boolean()),
marketingOptInAt: v.optional(v.number()),

createdAt: v.number(),
})
.index("by_email", ["email"])
.index("by_clerkUserId", ["clerkUserId"]),

  // 2. projects — long-lived container for work
  projects: defineTable({
    builderId: v.id("builders"),
    name: v.string(),
    siteAddress: v.optional(v.string()),
    siteAddressDetails: v.optional(
      v.object({
        formattedAddress: v.string(),
        lat: v.number(),
        lng: v.number(),
        placeId: v.string(),
      })
    ),
    status: v.optional(v.union(v.literal("draft"), v.literal("active"))),
    setupStage: v.optional(v.string()),
    setupCustomStageLabel: v.optional(v.string()),
    builderNotes: v.optional(v.string()),
    archived: v.boolean(),
    // Feature 3: project image
    imageR2Key: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
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
      v.literal("imported"),
      v.literal("system_required")
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

  // -----------------------------
  // Manufacturer Portal + Library
  // -----------------------------

  // 11. manufacturers — manufacturer accounts
  manufacturers: defineTable({
    name: v.string(),
    website: v.optional(v.string()),
    manufacturerType: v.union(
      v.literal("proprietary"),
      v.literal("component"),
      v.literal("mixed")
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("suspended")
    ),
    notesInternal: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_name", ["name"]),

  // 12. manufacturerUsers — who can access a manufacturer account
  manufacturerUsers: defineTable({
    manufacturerId: v.id("manufacturers"),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("editor")),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_manufacturer", ["manufacturerId"])
    .index("by_email", ["email"]),

  // 13. systems — global (BuildQuote-owned) system master
  systems: defineTable({
    nameGeneric: v.string(),
    systemType: v.union(v.literal("proprietary"), v.literal("non_proprietary")),
    primaryStages: v.array(v.string()),
    description: v.optional(v.string()),
    driverComponentType: v.string(),
    advisoryOnly: v.boolean(),
    status: v.union(v.literal("draft"), v.literal("approved"), v.literal("deprecated")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_name", ["nameGeneric"]),

  // 14. components — canonical component master (NOT the same as componentGroups)
  components: defineTable({
    nameGeneric: v.string(),
    category: v.union(v.literal("driver"), v.literal("dependent"), v.literal("accessory")),
    isDriver: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_name", ["nameGeneric"])
    .index("by_category", ["category"]),

  // 15. systemComponents — system ↔ component mapping (powers default tick list + ordering)
  systemComponents: defineTable({
    systemId: v.id("systems"),
    componentId: v.id("components"),
    defaultIncluded: v.boolean(),
    dependencyNotes: v.optional(v.string()),
    uiOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_system", ["systemId"])
    .index("by_system_order", ["systemId", "uiOrder"]),

  // 16. manufacturerSystems — manufacturer ↔ system mapping + approval status
  manufacturerSystems: defineTable({
    manufacturerId: v.id("manufacturers"),
    systemId: v.id("systems"),
    marketedName: v.string(),
    isPrimarySupplier: v.boolean(),
    status: v.union(
      v.literal("draft"),
      v.literal("pending_review"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    rejectionReason: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_manufacturer", ["manufacturerId"])
    .index("by_system", ["systemId"])
    .index("by_status", ["status"]),

  // 17. manufacturerSkus — proprietary SKUs (only required when systemType = proprietary)
  manufacturerSkus: defineTable({
    manufacturerId: v.id("manufacturers"),
    systemId: v.id("systems"),
    componentId: v.id("components"),
    skuCode: v.string(),
    description: v.string(),
    attributes: v.object({
      size: v.optional(v.string()),
      length: v.optional(v.string()),
      material: v.optional(v.string()),
      treatment: v.optional(v.string()),
      profile: v.optional(v.string()),
      thickness: v.optional(v.string()),
    }),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_manufacturer", ["manufacturerId"])
    .index("by_system", ["systemId"])
    .index("by_component", ["componentId"])
    .index("by_sku", ["skuCode"]),

  // 18. referenceDocuments — global reference docs stored in R2 (approved before visible to builders)
  referenceDocuments: defineTable({
    manufacturerId: v.id("manufacturers"),
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
    publicUrl: v.optional(v.string()),
    advisoryOnly: v.boolean(),
    status: v.union(
      v.literal("draft"),
      v.literal("pending_review"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    rejectionReason: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_manufacturer", ["manufacturerId"])
    .index("by_system", ["systemId"])
    .index("by_status", ["status"])
    .index("by_docType", ["docType"]),

  compatibilityRules: defineTable({
    systemId: v.string(),
    driverAttribute: v.string(),
    driverValue: v.string(),
    requiredComponentIds: v.array(v.id("components")),
  })
    .index("by_system", ["systemId"])
    .index("by_system_driver", ["systemId", "driverValue"]),
});
