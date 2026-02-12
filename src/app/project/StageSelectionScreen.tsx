// S4 — Stage Selection
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BUILD_STAGES, type BuildStage } from "../../types/stage";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StickyFooter } from "../../components/ui/StickyFooter";

export function StageSelectionScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [selectedStage, setSelectedStage] = useState<BuildStage | null>(null);
  const [customLabel, setCustomLabel] = useState("");

  const canContinue =
    Boolean(selectedStage) &&
    (selectedStage !== "Builder Custom Stage" || Boolean(customLabel.trim()));

  const handleContinue = () => {
    if (!canContinue || !selectedStage) return;

    const params = new URLSearchParams({ stage: selectedStage });
    if (selectedStage === "Builder Custom Stage") {
      params.set("customLabel", customLabel.trim());
    }

    navigate(`/projects/${projectId}/scope?${params.toString()}`);
  };

  return (
    <div className="screen stage-selection">
      <header>
        <Button
          variant="secondary"
          onClick={() => navigate(`/projects/${projectId}`)}
        >
          ← Back
        </Button>
        <h2>Select Build Stage</h2>
      </header>

      <Card>
        <div className="stage-selector">
          <div className="stage-pills">
            {BUILD_STAGES.map((stage) => (
              <button
                key={stage}
                type="button"
                className={`stage-pill${selectedStage === stage ? " selected" : ""}`}
                onClick={() => setSelectedStage(stage)}
              >
                {stage}
              </button>
            ))}
          </div>

          {selectedStage === "Builder Custom Stage" && (
            <input
              type="text"
              placeholder="Example: Pool house framing"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              className="bq-input custom-stage-input"
            />
          )}
        </div>
      </Card>

      <StickyFooter>
        <Button disabled={!canContinue} onClick={handleContinue}>
          Continue
        </Button>
      </StickyFooter>
    </div>
  );
}
