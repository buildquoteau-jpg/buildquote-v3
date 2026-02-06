import type { Id } from "../../convex/_generated/dataModel";

export type PurchaseUnit = "each" | "pack" | "box" | "bag";

export type LineItemSource = "builder_defined" | "ai_suggested" | "imported";

export interface LineItem {
  _id: Id<"lineItems">;
  quoteRequestId: Id<"quoteRequests">;
  componentGroupId: Id<"componentGroups">;
  isDriver: boolean;
  description: string;
  spec?: string;
  dimensions?: string;
  unit: PurchaseUnit;
  packSize?: string;
  quantity: number;
  source: LineItemSource;
  originalText?: string;
  createdAt: number;
}
