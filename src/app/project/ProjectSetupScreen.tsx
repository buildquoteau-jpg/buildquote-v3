// S2 - Project Setup
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { AddressFinder } from "../../components/AddressFinder";
import { StageSelector } from "../../components/StageSelector";
import { ImageUploader } from "../../components/ImageUploader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StickyFooter } from "../../components/ui/StickyFooter";
import { TextField } from "../../components/ui/TextField";
import { useBuilderAccount } from "../hooks/useBuilderAccount";
import { BUILD_STAGES, type BuildStage } from "../../types/stage";
import type { ProjectAddress } from "../../types/project";

function isBuildStage(value: string | undefined): value is BuildStage {
  if (!value) return false;
  return BUILD_STAGES.includes(value as BuildStage);
}

function toManualAddress(value: string): ProjectAddress {
  const formattedAddress = value.trim();
  const safeAddressKey = encodeURIComponent(formattedAddress.toLowerCase()).slice(0, 120);
  return {
    formattedAddress,
    lat: 0,
    lng: 0,
    placeId: `manual:${safeAddressKey}`,
  };
}

export function ProjectSetupScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string }>();
  const existingProjectId = projectId ? (projectId as Id<"projects">) : undefined;
  const existingProject = useQuery(
    api.projects.getProject,
    existingProjectId ? { projectId: existingProjectId } : "skip"
  );
  const saveProjectSetup = useMutation(api.projects.saveProjectSetup);
  const { ensureBuilder } = useBuilderAccount();

  const [projectName, setProjectName] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<ProjectAddress | null>(null);
  const [selectedStage, setSelectedStage] = useState<BuildStage | null>(null);
  const [customLabel, setCustomLabel] = useState("");
  const [builderNotes, setBuilderNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasLoadedInitialStateRef = useRef(false);

  useEffect(() => {
    if (!existingProjectId) return;
    if (existingProject === undefined) return;

    if (!existingProject) {
      navigate("/app", { replace: true });
      return;
    }
    if (hasLoadedInitialStateRef.current) return;

    hasLoadedInitialStateRef.current = true;
    setProjectName(existingProject.name ?? "");
    setSiteAddress(
      existingProject.siteAddressDetails?.formattedAddress ??
        existingProject.siteAddress ??
        ""
    );
    setSelectedAddress(
      existingProject.siteAddressDetails ??
        (existingProject.siteAddress ? toManualAddress(existingProject.siteAddress) : null)
    );
    setBuilderNotes(existingProject.builderNotes ?? "");

    if (isBuildStage(existingProject.setupStage)) {
      setSelectedStage(existingProject.setupStage);
      setCustomLabel(existingProject.setupCustomStageLabel ?? "");
      return;
    }

    if (existingProject.setupCustomStageLabel?.trim()) {
      setSelectedStage("Builder Custom Stage");
      setCustomLabel(existingProject.setupCustomStageLabel.trim());
      return;
    }

    if (existingProject.setupStage?.trim()) {
      setSelectedStage("Builder Custom Stage");
      setCustomLabel(existingProject.setupStage.trim());
    }
  }, [existingProject, existingProjectId, navigate]);

  const handleImageSelected = (file: File) => {
    void file;
  };

  const handleAddressChange = (nextValue: string) => {
    setSiteAddress(nextValue);
    if (!selectedAddress) return;
    if (nextValue.trim() === selectedAddress.formattedAddress) return;
    setSelectedAddress(null);
  };

  const canContinue =
    Boolean(projectName.trim()) &&
    Boolean(siteAddress.trim()) &&
    Boolean(selectedStage) &&
    (selectedStage !== "Builder Custom Stage" || Boolean(customLabel.trim()));

  const canSaveDraft = Boolean(projectName.trim()) && Boolean(siteAddress.trim());

  const handleSave = async (targetStatus: "draft" | "active") => {
    if (targetStatus === "active" && !canContinue) return;
    if (targetStatus === "draft" && !canSaveDraft) return;

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const builderId = await ensureBuilder();
      const address = selectedAddress ?? toManualAddress(siteAddress);
      const stage = selectedStage ?? undefined;
      if (targetStatus === "active" && !stage) {
        throw new Error("Build stage is required to continue.");
      }

      const customStageLabel =
        stage === "Builder Custom Stage" ? customLabel.trim() : undefined;

      const savedProjectId = await saveProjectSetup({
        projectId: existingProjectId,
        builderId,
        name: projectName.trim(),
        address,
        stage,
        customStageLabel,
        builderNotes: builderNotes.trim(),
        status: targetStatus,
      });

      if (targetStatus === "draft") {
        navigate("/app");
        return;
      }

      navigate(`/app/project/${savedProjectId}/scope`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save project setup."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="screen project-setup">
      <header>
        <Button variant="secondary" onClick={() => navigate("/app")}>
          Back to dashboard
        </Button>
        <h2>{existingProjectId ? "Edit Project Setup" : "Project Setup"}</h2>
      </header>

      {errorMessage ? <div className="settings-message">{errorMessage}</div> : null}

      <Card>
        <div className="field">
          <TextField
            label="Project name"
            placeholder="Example: Smith Residence"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
          />
        </div>

        <div className="field">
          <label>Site address</label>
          <AddressFinder
            value={siteAddress}
            onChange={handleAddressChange}
            onAddressSelect={setSelectedAddress}
          />
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
          <label htmlFor="builder-notes">Builder notes</label>
          <textarea
            id="builder-notes"
            className="bq-textarea"
            placeholder="Site manager, access constraints, and special conditions."
            value={builderNotes}
            onChange={(event) => setBuilderNotes(event.target.value)}
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
        <Button
          variant="secondary"
          onClick={() => void handleSave("draft")}
          disabled={isSaving || !canSaveDraft}
        >
          Save Draft
        </Button>
        <Button
          onClick={() => void handleSave("active")}
          disabled={isSaving || !canContinue}
        >
          Continue
        </Button>
      </StickyFooter>
    </div>
  );
}
