// S2b - Existing Project Picker
// READS: projects (list)
// WRITES: none
// AI RULES: no AI suggestions, no interpretation, no automation

import { useNavigate } from "react-router-dom";
import { ProjectCard } from "../../components/ProjectCard";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import {
  FALLBACK_PROJECTS,
  type DashboardProjectCardData,
  useBuilderDashboardData,
} from "../dashboard/useBuilderDashboardData";

const hasClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);

interface ExistingProjectLayoutProps {
  projectCards: DashboardProjectCardData[];
  isDataLoading: boolean;
}

function ExistingProjectLayout({
  projectCards,
  isDataLoading,
}: ExistingProjectLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="screen project-existing">
      <header>
        <Button variant="secondary" onClick={() => navigate("/app")}>
          Back to dashboard
        </Button>
        <h2>Add to Existing Project</h2>
      </header>

      <p className="hint">Select a project to continue building.</p>

      {isDataLoading ? (
        <p className="hint">Loading projects...</p>
      ) : projectCards.length > 0 ? (
        <div className="project-card-list">
          {projectCards.map((project) => (
            <ProjectCard
              key={project.id}
              name={project.name}
              stageLabel={project.stageLabel}
              imageUrl={project.imageUrl}
              onClick={() => navigate(`/app/project/${project.id}/scope`)}
            />
          ))}
        </div>
      ) : (
        <Card className="dashboard-empty" compact>
          <p className="hint">No projects are available yet.</p>
        </Card>
      )}
    </div>
  );
}

function ConnectedExistingProjectScreen() {
  const { projectCards, isDataLoading } = useBuilderDashboardData();
  return (
    <ExistingProjectLayout
      projectCards={projectCards}
      isDataLoading={isDataLoading}
    />
  );
}

function FallbackExistingProjectScreen() {
  return (
    <ExistingProjectLayout projectCards={FALLBACK_PROJECTS} isDataLoading={false} />
  );
}

export function ExistingProjectScreen() {
  if (hasClerk && hasConvex) {
    return <ConnectedExistingProjectScreen />;
  }
  return <FallbackExistingProjectScreen />;
}
