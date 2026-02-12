import type { Id } from "../../convex/_generated/dataModel";

export type ProjectStatus = "draft" | "active";

export interface ProjectAddress {
  formattedAddress: string;
  lat: number;
  lng: number;
  placeId: string;
}

export interface ProjectRecord {
  _id: Id<"projects">;
  builderId: Id<"builders">;
  name: string;
  siteAddress?: string;
  siteAddressDetails?: ProjectAddress;
  status?: ProjectStatus;
  setupStage?: string;
  setupCustomStageLabel?: string;
  builderNotes?: string;
  archived: boolean;
  imageR2Key?: string;
  imageUrl?: string;
  createdAt: number;
  updatedAt?: number;
}
