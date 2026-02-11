import type { BuildStage } from "../types/stage";

export interface QuoteFlowDraft {
  projectName: string;
  siteAddress: string;
  selectedStage: BuildStage | null;
  customStageLabel: string;
  scopeText: string;
}

const STORAGE_KEY = "buildquote.quote-flow-draft";

const EMPTY_DRAFT: QuoteFlowDraft = {
  projectName: "",
  siteAddress: "",
  selectedStage: null,
  customStageLabel: "",
  scopeText: "",
};

export function readQuoteFlowDraft(): QuoteFlowDraft {
  if (typeof window === "undefined") {
    return EMPTY_DRAFT;
  }

  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return EMPTY_DRAFT;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<QuoteFlowDraft>;
    return {
      ...EMPTY_DRAFT,
      ...parsed,
    };
  } catch {
    return EMPTY_DRAFT;
  }
}

export function writeQuoteFlowDraft(patch: Partial<QuoteFlowDraft>) {
  if (typeof window === "undefined") {
    return;
  }

  const next = {
    ...readQuoteFlowDraft(),
    ...patch,
  };

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
