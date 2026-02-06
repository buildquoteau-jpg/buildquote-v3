import type { Id } from "../../convex/_generated/dataModel";

export type QuoteStatus = "draft" | "sent";

export type FulfilmentType = "delivery" | "pickup";

export interface Scope {
  id: string;
  stageContext?: string;
  scopeText: string;
  createdAt: number;
}

export interface DeliveryDetails {
  address: string;
  window?: string;
}

export interface QuoteRequest {
  _id: Id<"quoteRequests">;
  projectId: Id<"projects">;
  builderId: Id<"builders">;
  stage: string;
  customStageLabel?: string;
  scopes: Scope[];
  status: QuoteStatus;
  fulfilmentType?: FulfilmentType;
  deliveryDetails?: DeliveryDetails;
  pickupLocation?: string;
  projectStartDate?: number;
  requiredByDate?: number;
  supplierMessage?: string;
  createdAt: number;
  updatedAt: number;
}
