import type { Id } from "../../convex/_generated/dataModel";

export interface Supplier {
  _id: Id<"suppliers">;
  builderId: Id<"builders">;
  name: string;
  email: string;
  phone?: string;
  builderAccountRef?: string;
  tradingTerms?: string;
  notes?: string;
  createdAt: number;
}

export type RFQStatus = "sent" | "will_quote" | "declined";

export interface SupplierRFQ {
  _id: Id<"supplierRFQs">;
  quoteRequestId: Id<"quoteRequests">;
  supplierId: Id<"suppliers">;
  sentAt: number;
  status: RFQStatus;
  respondedAt?: number;
  declineReason?: string;
}
