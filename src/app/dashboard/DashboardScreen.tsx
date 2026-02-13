// S2 — Builder Dashboard
import type { KeyboardEvent } from "react";
import { UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { ProjectCard } from "../../components/ProjectCard";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Link } from "react-router-dom";
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
    navigate("/projects/new?sandbox=1");
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
            <Button to="/dashboard" variant="secondary" className="dashboard-nav-item is-active">
              Projects
            </Button>
            <Button to="/suppliers" variant="secondary" className="dashboard-nav-item">
              Suppliers
            </Button>
            <Button to="/library" variant="secondary" className="dashboard-nav-item">
              Library
            </Button>
            <Button to="/profile" variant="secondary" className="dashboard-nav-item">
              Profile
            </Button>
          </nav>
          <div className="dashboard-avatar">
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>
      </header>

      <div className="primary-actions">
        <Button to="/projects/new">New Project</Button>
        <Button variant="secondary" to="/projects/new">
          Add to Existing Project
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
                status={project.status}
                imageUrl={project.imageUrl}
                createdAt={project.createdAt}
                onClick={() => navigate(`/projects/${project.id}`)}
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
