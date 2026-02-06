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
      {BUILD_STAGES.map((stage) => (
        <label key={stage} className="stage-option">
          <input
            type="radio"
            name="buildStage"
            value={stage}
            checked={selected === stage}
            onChange={() => onSelect(stage)}
          />
          <span>{stage}</span>
        </label>
      ))}
      {selected === "Builder Custom Stage" && (
        <input
          type="text"
          placeholder='Example: Pool house framing'
          value={customLabel}
          onChange={(e) => onCustomLabelChange(e.target.value)}
          className="custom-stage-input"
        />
      )}
    </div>
  );
}
