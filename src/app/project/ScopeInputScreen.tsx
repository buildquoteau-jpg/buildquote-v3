// S3 — Scope of Works Input
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ScopeInput } from "../../components/ScopeInput";
import { DisclaimerBlock } from "../../components/DisclaimerBlock";
import { readQuoteFlowDraft, writeQuoteFlowDraft } from "../../lib/quoteDraft";
import { Button, Card, StickyFooter } from "../../components/ui";

const STAGE_EXAMPLES: Record<string, string> = {
  "Decking / Pergola / Outdoor Structures": "Example: Supply of H4 structural posts, post stirrups, concrete and fixings for an external pergola structure.",
  "Builder Custom Stage": "Example: Supply of framing timber, sheet materials and fixings for a custom builder-defined stage.",
};

export function ScopeInputScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const draft = useMemo(() => readQuoteFlowDraft(), []);
  const [scopeText, setScopeText] = useState(draft.scopeText);

  const suggestion =
    STAGE_EXAMPLES[draft.selectedStage ?? "Builder Custom Stage"] ?? STAGE_EXAMPLES["Builder Custom Stage"];

  return (
    <div className="screen scope-input">
      <header>
        <Button variant="ghost" onClick={() => navigate("/project/new")}>← Project Setup</Button>
        <h2>Scope of Works</h2>
      </header>

      <Card>
        <ScopeInput value={scopeText} onChange={setScopeText} stageSuggestion={suggestion} />
        <DisclaimerBlock />
      </Card>

      <StickyFooter>
        <Button
          variant="primary"
          disabled={!scopeText.trim()}
          onClick={() => {
            writeQuoteFlowDraft({ scopeText: scopeText.trim() });
            navigate(`/project/${projectId}/materials`);
          }}
        >
          Continue
        </Button>
      </StickyFooter>
    </div>
  );
}
