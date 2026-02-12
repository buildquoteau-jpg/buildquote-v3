// S1 - Builder Dashboard
import type { KeyboardEvent } from "react";
import { UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { ProjectCard } from "../../components/ProjectCard";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { IconButton } from "../../components/ui/IconButton";
import {
  FALLBACK_PROJECTS,
  type DashboardProjectCardData,
  useBuilderDashboardData,
} from "./useBuilderDashboardData";

const hasClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);

interface DashboardContentProps {
  companyName?: string;
  logoUrl?: string;
  projectCards: DashboardProjectCardData[];
  welcomeName?: string;
  isDataLoading: boolean;
}

function DashboardContent({
  companyName,
  logoUrl,
  projectCards,
  welcomeName,
  isDataLoading,
}: DashboardContentProps) {
  const navigate = useNavigate();
  const welcomeHeading = welcomeName ? `Welcome back, ${welcomeName}` : "Welcome back";

  const openSandbox = () => {
    navigate("/app/project/new?sandbox=1");
  };

  const handleSandboxKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openSandbox();
  };

  return (
    <div className="screen dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <div className="dashboard-brand">
            {logoUrl ? (
              <img src={logoUrl} alt="Builder logo" className="dashboard-logo" />
            ) : (
              <div className="dashboard-logo-placeholder" aria-hidden>
                BQ
              </div>
            )}
            <div className="dashboard-brand-copy">
              <strong className="dashboard-brand-title">BuildQuote</strong>
              {companyName ? (
                <span className="dashboard-brand-subtitle">{companyName}</span>
              ) : null}
            </div>
          </div>

          <div className="dashboard-header-copy">
            <h1>{welcomeHeading}</h1>
          </div>
        </div>

        <div className="dashboard-header-right">
          <nav className="dashboard-top-nav" aria-label="Dashboard sections">
            <Button to="/app" variant="secondary" className="dashboard-nav-item is-active">
              Projects
            </Button>
            <Button to="/app/suppliers" variant="secondary" className="dashboard-nav-item">
              Suppliers
            </Button>
            <Button to="/app/library" variant="secondary" className="dashboard-nav-item">
              Library
            </Button>
            <Button to="/app/profile" variant="secondary" className="dashboard-nav-item">
              Profile
            </Button>
          </nav>

          <IconButton
            type="button"
            aria-label="Open settings"
            onClick={() => navigate("/app/settings")}
          >
            {"\u2699\uFE0E"}
          </IconButton>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </header>

      <div className="primary-actions">
        <Button to="/app/project/new">New project</Button>
        <Button variant="secondary" to="/app/project/existing">
          Add to existing project
        </Button>
      </div>

      <section className="project-tiles">
        <h2>Projects</h2>

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
            <p className="hint">No projects yet. Start a new project to begin.</p>
          </Card>
        )}
      </section>

      <Card
        className="sandbox sandbox--interactive"
        compact
        role="button"
        tabIndex={0}
        onClick={openSandbox}
        onKeyDown={handleSandboxKeyDown}
      >
        <h3>Sandbox</h3>
        <p className="hint">Practice mode. Supplier notifications stay off.</p>
      </Card>
    </div>
  );
}

function ConnectedDashboardScreen() {
  const { companyName, logoUrl, projectCards, welcomeName, isDataLoading } =
    useBuilderDashboardData();

  return (
    <DashboardContent
      companyName={companyName}
      logoUrl={logoUrl}
      projectCards={projectCards}
      welcomeName={welcomeName}
      isDataLoading={isDataLoading}
    />
  );
}

function FallbackDashboardScreen() {
  return <DashboardContent projectCards={FALLBACK_PROJECTS} isDataLoading={false} />;
}

export function DashboardScreen() {
  if (hasClerk && hasConvex) {
    return <ConnectedDashboardScreen />;
  }
  return <FallbackDashboardScreen />;
}
