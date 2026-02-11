// S2 — Project Setup
// OWNS: project context capture (name, site address, stage context).
// DOES NOT DECIDE: pricing, compliance, supplier eligibility, or quote outcomes.
// WRITES: project { name, siteAddress, stages[] }
// AI RULES: AI does not validate or restrict stages

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddressFinder } from "../../components/AddressFinder";
import { StageSelector } from "../../components/StageSelector";
import { ImageUploader } from "../../components/ImageUploader";
import { readQuoteFlowDraft, writeQuoteFlowDraft } from "../../lib/quoteDraft";
import type { BuildStage } from "../../types/stage";

export function ProjectSetupScreen() {
  const navigate = useNavigate();
  const savedDraft = useMemo(() => readQuoteFlowDraft(), []);

  const [projectName, setProjectName] = useState(savedDraft.projectName);
  const [siteAddress, setSiteAddress] = useState(savedDraft.siteAddress);
  const [selectedStage, setSelectedStage] = useState<BuildStage | null>(savedDraft.selectedStage);
  const [customLabel, setCustomLabel] = useState(savedDraft.customStageLabel);

  const handleImageSelected = (file: File) => {
    void file;
    // Reserved for project image upload flow.
  };

  const handleContinue = () => {
    writeQuoteFlowDraft({
      projectName: projectName.trim(),
      siteAddress: siteAddress.trim(),
      selectedStage,
      customStageLabel: customLabel.trim(),
    });

    const projectId = "draft";
    navigate(`/project/${projectId}/scope`);
  };

  return (
    <div className="screen project-setup">
      <header>
        <button className="btn secondary" onClick={() => navigate("/")}>
          ← Dashboard
        </button>
        <h2>Project Setup</h2>
      </header>

      <div className="field">
        <label>Project name</label>
        <input
          type="text"
          placeholder="Example: Smith Residence"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Site address</label>
        <AddressFinder value={siteAddress} onChange={setSiteAddress} />
      </div>

      <div className="field">
        <label>Build stage</label>
        <StageSelector
          selected={selectedStage}
          onSelect={setSelectedStage}
          customLabel={customLabel}
          onCustomLabelChange={setCustomLabel}
        />
      </div>

      <div className="field">
        <ImageUploader
          label="Project photo (optional)"
          onFileSelected={handleImageSelected}
        />
      </div>

      <button
        className="btn primary"
        onClick={handleContinue}
        disabled={
          !projectName.trim() ||
          !selectedStage ||
          (selectedStage === "Builder Custom Stage" && !customLabel.trim())
        }
      >
        Continue
      </button>
    </div>
  );
}
