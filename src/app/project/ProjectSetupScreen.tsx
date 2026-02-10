// S2 — Project Setup
// WRITES: project { name, siteAddress, stages[] }
// AI RULES: AI does not validate or restrict stages

import { useState } from "react";
import { AddressFinder } from "../../components/AddressFinder";
import { StageSelector } from "../../components/StageSelector";
import type { BuildStage } from "../../types/stage";

export function ProjectSetupScreen() {
  const [projectName, setProjectName] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [selectedStage, setSelectedStage] = useState<BuildStage | null>(null);
  const [customLabel, setCustomLabel] = useState("");

  return (
    <div className="screen project-setup">
      <h2>Project Setup</h2>

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

      <button className="btn primary">Continue</button>
    </div>
  );
}
