// S2 — Project Setup
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddressFinder } from "../../components/AddressFinder";
import { StageSelector } from "../../components/StageSelector";
import { ImageUploader } from "../../components/ImageUploader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StickyFooter } from "../../components/ui/StickyFooter";
import { TextField } from "../../components/ui/TextField";
import type { BuildStage } from "../../types/stage";

export function ProjectSetupScreen() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [selectedStage, setSelectedStage] = useState<BuildStage | null>(null);
  const [customLabel, setCustomLabel] = useState("");
  const handleImageSelected = (file: File) => {
    void file;
  };

  const handleContinue = () => {
    const projectId = "draft";
    navigate(`/project/${projectId}/scope`);
  };

  return (
    <div className="screen project-setup">
      <header>
        <Button variant="secondary" onClick={() => navigate("/")}>← Dashboard</Button>
        <h2>Project Setup</h2>
      </header>

      <Card>
        <div className="field">
          <TextField
            label="Project name"
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
            label="Upload project photo (optional)"
            onFileSelected={handleImageSelected}
          />
        </div>
      </Card>

      <StickyFooter>
        <Button onClick={handleContinue} disabled={!projectName.trim() || !selectedStage}>
          Continue
        </Button>
      </StickyFooter>
    </div>
  );
}
