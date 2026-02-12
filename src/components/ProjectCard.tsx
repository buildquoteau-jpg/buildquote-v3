import type { KeyboardEvent } from "react";
import { Card } from "./ui/Card";

interface ProjectCardProps {
  name: string;
  stageLabel: string;
  imageUrl?: string;
  className?: string;
  onClick?: () => void;
}

export function ProjectCard({
  name,
  stageLabel,
  imageUrl,
  className = "",
  onClick,
}: ProjectCardProps) {
  const interactive = typeof onClick === "function";

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!interactive || !onClick) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onClick();
  };

  return (
    <Card
      className={`project-card ${interactive ? "project-card--clickable" : ""} ${className}`.trim()}
      compact
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? onClick : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={`${name} site photo`} className="project-card-thumb" />
      ) : (
        <div className="project-card-thumb-placeholder" aria-hidden>
          <span>No photo</span>
        </div>
      )}

      <div className="project-card-meta">
        <strong>{name}</strong>
        <span className="bq-badge bq-badge--neutral">{stageLabel}</span>
      </div>

      {interactive ? (
        <span className="project-card-chevron" aria-hidden>
          {">"}
        </span>
      ) : null}
    </Card>
  );
}
