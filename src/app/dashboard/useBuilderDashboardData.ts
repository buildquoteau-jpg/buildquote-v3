import { useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export interface DashboardProjectCardData {
  id: string;
  name: string;
  imageUrl?: string;
  stageLabel: string;
}

export const FALLBACK_PROJECTS: DashboardProjectCardData[] = [
  {
    id: "fallback-smith-residence",
    name: "Smith Residence",
    stageLabel: "Framing",
  },
  {
    id: "fallback-garden-studio",
    name: "Garden Studio",
    stageLabel: "Decking",
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
  const { user } = useUser();
  const clerkFirstName = user?.firstName?.trim() ?? "";
  const email = user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase() ?? "";

  const builderProfile = useQuery(
    api.builders.getBuilderByEmail,
    email ? { email } : "skip"
  );

  const builderId = builderProfile?._id;
  const projects = useQuery(
    api.projects.listProjectsByBuilder,
    builderId ? { builderId } : "skip"
  );
  const quoteRequests = useQuery(
    api.quoteRequests.listByBuilder,
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
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((project) => {
        const key = String(project._id);
        return {
          id: key,
          name: project.name,
          imageUrl: project.imageUrl,
          stageLabel: stageByProjectId.get(key) ?? "Not started",
        };
      });
  }, [projects, quoteRequests]);

  const builderBusinessName = readBuilderBusinessName(builderProfile);
  const welcomeName = clerkFirstName || builderBusinessName;
  const companyName =
    (builderProfile?.companyName ?? builderBusinessName).trim() || undefined;

  const isBuilderLoading = Boolean(email) && builderProfile === undefined;
  const isProjectLoading = Boolean(builderId) && projects === undefined;
  const isQuotesLoading = Boolean(builderId) && quoteRequests === undefined;

  return {
    companyName,
    logoUrl: builderProfile?.logoUrl,
    projectCards,
    welcomeName,
    isDataLoading: isBuilderLoading || isProjectLoading || isQuotesLoading,
  };
}
