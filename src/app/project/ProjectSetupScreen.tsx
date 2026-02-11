// S2 — Project Setup
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddressFinder } from "../../components/AddressFinder";
import { StageSelector } from "../../components/StageSelector";
import { ImageUploader } from "../../components/ImageUploader";
import { readQuoteFlowDraft, writeQuoteFlowDraft } from "../../lib/quoteDraft";
import type { BuildStage } from "../../types/stage";
import { Button, Card, StickyFooter, Input } from "../../components/ui";

export function ProjectSetupScreen() {
  const navigate = useNavigate();
  const savedDraft = useMemo(() => readQuoteFlowDraft(), []);
  const [projectName, setProjectName] = useState(savedDraft.projectName);
  const [siteAddress, setSiteAddress] = useState(savedDraft.siteAddress);
  const [selectedStage, setSelectedStage] = useState<BuildStage | null>(savedDraft.selectedStage);
  const [customLabel, setCustomLabel] = useState(savedDraft.customStageLabel);

  const handleContinue = () => {
    writeQuoteFlowDraft({
      projectName: projectName.trim(),
      siteAddress: siteAddress.trim(),
      selectedStage,
      customStageLabel: customLabel.trim(),
    });
    navigate(`/project/draft/scope`);
  };

  return (
    <div className="screen project-setup">
      <header>
        <Button variant="ghost" onClick={() => navigate("/")}>← Dashboard</Button>
        <h2>Project Setup</h2>
      </header>

      <Card>
        <div className="field">
          <label className="bq-label">Project name</label>
          <Input
            type="text"
            placeholder="Example: Smith Residence"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="bq-label">Site address</label>
          <AddressFinder value={siteAddress} onChange={setSiteAddress} />
        </div>

        <div className="field">
          <label className="bq-label">Build stage</label>
          <StageSelector
            selected={selectedStage}
            onSelect={setSelectedStage}
            customLabel={customLabel}
            onCustomLabelChange={setCustomLabel}
          />
        </div>

        <div className="field">
          <ImageUploader label="Project photo (optional)" onFileSelected={() => undefined} />
        </div>
      </Card>

      <StickyFooter>
        <Button
          variant="primary"
          onClick={handleContinue}
          disabled={!projectName.trim() || !selectedStage || (selectedStage === "Builder Custom Stage" && !customLabel.trim())}
        >
          Continue
        </Button>
      </StickyFooter>
    </div>
  );
}
