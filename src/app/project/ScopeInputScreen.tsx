// S3 — Scope of Works Input
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ScopeInput } from "../../components/ScopeInput";
import { DisclaimerBlock } from "../../components/DisclaimerBlock";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StickyFooter } from "../../components/ui/StickyFooter";

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
  "Builder Custom Stage": "",
};

export function ScopeInputScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [scopeText, setScopeText] = useState("");
  const currentStage = "Decking / Pergola / Outdoor Structures";
  const suggestion = STAGE_EXAMPLES[currentStage];

  return (
    <div className="screen scope-input">
      <header>
        <Button variant="secondary" onClick={() => navigate("/app/project/new")}>
          ← Project Setup
        </Button>
        <h2>Scope of Works</h2>
      </header>

      <Card>
        <ScopeInput
          value={scopeText}
          onChange={setScopeText}
          stageSuggestion={suggestion}
        />
      </Card>

      <Card compact>
        <DisclaimerBlock />
      </Card>

      <StickyFooter>
        <Button
          disabled={!scopeText.trim()}
          onClick={() => navigate(`/app/project/${projectId}/materials`)}
        >
          Continue
        </Button>
      </StickyFooter>
    </div>
  );
}
