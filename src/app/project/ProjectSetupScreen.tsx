// S2 — Project Setup
// WRITES: project { name, siteAddress, stages[] }
// AI RULES: AI does not validate or restrict stages

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddressFinder } from "../../components/AddressFinder";
import { StageSelector } from "../../components/StageSelector";
import { ImageUploader } from "../../components/ImageUploader";
import type { BuildStage } from "../../types/stage";

export function ProjectSetupScreen() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [selectedStage, setSelectedStage] = useState<BuildStage | null>(null);
  const [customLabel, setCustomLabel] = useState("");
  const [_projectImage, setProjectImage] = useState<File | null>(null);

  const handleImageSelected = (file: File) => {
    setProjectImage(file);
    // TODO: upload to R2 after project is created and we have projectId
    // Use projectImageR2Key(projectId, file.name) + uploadImage()
    // Then call saveProjectImage mutation
  };

  const handleContinue = () => {
    // TODO: create project via Convex mutation and use returned projectId
    // For now, use a placeholder ID to enable navigation flow
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
        disabled={!projectName.trim() || !selectedStage}
      >
        Continue
      </button>
    </div>
  );
}
