import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useBuilderAccount } from "../hooks/useBuilderAccount";
import type { ProjectStatus } from "../../types/project";

export interface DashboardProjectCardData {
  id: string;
  name: string;
  imageUrl?: string;
  stageLabel: string;
  status: ProjectStatus;
  createdAt?: number;
}

export const FALLBACK_PROJECTS: DashboardProjectCardData[] = [
  {
    id: "fallback-smith-residence",
    name: "Smith Residence",
    stageLabel: "Framing",
    status: "active",
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: "fallback-garden-studio",
    name: "Garden Studio",
    stageLabel: "Decking",
    status: "draft",
    createdAt: Date.now() - 86400000,
  },
];

function formatStageLabel(rawStage?: string, customStageLabel?: string): string {
  const source = (customStageLabel ?? rawStage ?? "").trim();
  if (!source) return "Not started";

  return source
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function readBuilderBusinessName(builderProfile: unknown): string {
  if (!builderProfile || typeof builderProfile !== "object") return "";
  const profile = builderProfile as Record<string, unknown>;

  if (typeof profile.businessName === "string" && profile.businessName.trim()) {
    return profile.businessName.trim();
  }

  if (typeof profile.companyName === "string" && profile.companyName.trim()) {
    return profile.companyName.trim();
  }

  return "";
}

export function useBuilderDashboardData() {
  const { builder, builderId, clerkFirstName, isUserLoaded } = useBuilderAccount();
  const quoteRequests = useQuery(
    api.quoteRequests.listByBuilder,
    builderId ? { builderId } : "skip"
  );
  const projects = useQuery(
    api.projects.listProjectsByBuilder,
    builderId ? { builderId } : "skip"
  );

  const projectCards = useMemo<DashboardProjectCardData[]>(() => {
    if (!projects) return [];

    const stageByProjectId = new Map<string, string>();
    if (quoteRequests) {
      const orderedQuoteRequests = [...quoteRequests].sort(
        (a, b) => (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt)
      );

      for (const quote of orderedQuoteRequests) {
        const key = String(quote.projectId);
        if (!stageByProjectId.has(key)) {
          stageByProjectId.set(
            key,
            formatStageLabel(quote.stage, quote.customStageLabel)
          );
        }
      }
    }

    return [...projects]
      .filter((project) => !project.archived)
      .sort((a, b) => (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt))
      .map((project) => {
        const key = String(project._id);
        const setupStageLabel = formatStageLabel(
          project.setupStage,
          project.setupCustomStageLabel
        );

        return {
          id: key,
          name: project.name,
          imageUrl: project.imageUrl,
          stageLabel: stageByProjectId.get(key) ?? setupStageLabel,
          status: project.status ?? "active",
          createdAt: project.createdAt,
        };
      });
  }, [projects, quoteRequests]);

  const builderBusinessName = readBuilderBusinessName(builder);

  // Only show "Welcome back, <Name>" when profile is complete (Convex record).
  // Never derive the welcome name from Clerk alone.
  const welcomeName = builder?.profileComplete
    ? (builder.firstName?.trim() || builderBusinessName || undefined)
    : undefined;

  const companyName =
    (builder?.companyName ?? builderBusinessName).trim() || undefined;

  const isProjectLoading = Boolean(builderId) && projects === undefined;
  const isQuotesLoading = Boolean(builderId) && quoteRequests === undefined;

  return {
    builderId,
    companyName,
    logoUrl: builder?.logoUrl,
    projectCards,
    welcomeName,
    isDataLoading: !isUserLoaded || isProjectLoading || isQuotesLoading,
  };
}
