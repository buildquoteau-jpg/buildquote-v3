import { BUILD_STAGES, type BuildStage } from "../types/stage";

interface StageSelectorProps {
  selected: string | null;
  onSelect: (stage: BuildStage) => void;
  customLabel: string;
  onCustomLabelChange: (label: string) => void;
}

export function StageSelector({
  selected,
  onSelect,
  customLabel,
  onCustomLabelChange,
}: StageSelectorProps) {
  return (
    <div className="stage-selector">
      <div className="stage-pills">
        {BUILD_STAGES.map((stage) => (
          <button
            key={stage}
            type="button"
            className={`stage-pill${selected === stage ? " selected" : ""}`}
            onClick={() => onSelect(stage)}
          >
            {stage}
          </button>
        ))}
      </div>
      {selected === "Builder Custom Stage" && (
        <input
          type="text"
          placeholder="Example: Pool house framing"
          value={customLabel}
          onChange={(e) => onCustomLabelChange(e.target.value)}
          className="custom-stage-input"
        />
      )}
    </div>
  );
}
