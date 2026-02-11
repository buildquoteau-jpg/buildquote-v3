// S3 — Scope of Works Input
// OWNS: verbatim builder scope capture and stage-relevant suggestion hint text.
// DOES NOT DECIDE: quantities, compliance, suitability, or product selection.
// WRITES: quoteRequest.scopeText (verbatim builder input)
// AI RULES: read only — prepares internal understanding, no output yet

import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ScopeInput } from "../../components/ScopeInput";
import { DisclaimerBlock } from "../../components/DisclaimerBlock";
import { readQuoteFlowDraft, writeQuoteFlowDraft } from "../../lib/quoteDraft";

const STAGE_EXAMPLES: Record<string, string> = {
  "Slab / Footings":
    "Example: Supply of reinforcement mesh, chairs, edge form timbers and concrete accessories for a 120m² residential slab.",
  "Wall Framing":
    "Example: Supply of treated pine wall frames, top and bottom plates, noggings and associated fasteners for single-storey residence.",
  "Roof Framing":
    "Example: Supply of roof trusses, ridge board, purlins, battens and associated brackets for a hip roof.",
  Roofing:
    "Example: Supply of Colorbond roofing sheets, ridge capping, flashings, screws and accessories.",
  "External Cladding":
    "Example: Supply of fibre cement cladding sheets, cavity battens, flashings, sealants and fixings.",
  "Internal Lining":
    "Example: Supply of plasterboard sheets, cornice, compounds, fasteners and accessories for internal walls and ceilings.",
  Insulation:
    "Example: Supply of wall and ceiling insulation batts to meet NCC R-value requirements for Climate Zone 5.",
  "Brickies Corner":
    "Example: Supply of clay bricks, mortar mix, lintels, ties and accessories for external brick veneer.",
  "Decking / Pergola / Outdoor Structures":
    "Example: Supply of H4 structural posts, post stirrups, concrete and fixings for an external pergola structure.",
  "Builder Custom Stage":
    "Example: Supply of framing timber, sheet materials and fixings for a custom builder-defined stage.",
};

export function ScopeInputScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const draft = useMemo(() => readQuoteFlowDraft(), []);
  const [scopeText, setScopeText] = useState(draft.scopeText);

  const stageLabel =
    draft.selectedStage === "Builder Custom Stage"
      ? draft.customStageLabel || draft.selectedStage
      : draft.selectedStage || "Decking / Pergola / Outdoor Structures";

  const suggestion =
    STAGE_EXAMPLES[draft.selectedStage ?? "Builder Custom Stage"] ??
    STAGE_EXAMPLES["Builder Custom Stage"];

  const handleContinue = () => {
    writeQuoteFlowDraft({ scopeText: scopeText.trim() });
    navigate(`/project/${projectId}/materials`);
  };

  return (
    <div className="screen scope-input">
      <header>
        <button className="btn secondary" onClick={() => navigate("/project/new")}>
          ← Project Setup
        </button>
        <h2>Scope of Works</h2>
      </header>

      <p className="hint">Stage context: {stageLabel}</p>

      <ScopeInput
        value={scopeText}
        onChange={setScopeText}
        stageSuggestion={suggestion}
      />

      <DisclaimerBlock />

      <button
        className="btn primary"
        disabled={!scopeText.trim()}
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );
}
