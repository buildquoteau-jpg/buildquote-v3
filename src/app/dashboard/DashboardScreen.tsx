// S2 — Builder Dashboard
import type { KeyboardEvent } from "react";
import { useState, useRef, useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { ProjectCard } from "../../components/ProjectCard";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import {
  FALLBACK_PROJECTS,
  type DashboardProjectCardData,
  useBuilderDashboardData,
} from "./useBuilderDashboardData";

const hasClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);

function ProfileMenu({
  initials,
  logoUrl,
}: {
  initials: string;
  logoUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { signOut } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="profile-menu" ref={menuRef}>
      <button
        type="button"
        className="profile-menu-trigger"
        onClick={() => setOpen(!open)}
        aria-label="Account menu"
      >
        {logoUrl ? (
          <img src={logoUrl} alt="" className="profile-menu-avatar-img" />
        ) : (
          <span className="profile-menu-avatar">{initials}</span>
        )}
      </button>
      {open && (
        <div className="profile-menu-dropdown">
          <button
            type="button"
            className="profile-menu-item"
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
          >
            Profile
          </button>
          <button
            type="button"
            className="profile-menu-item"
            onClick={() => {
              setOpen(false);
              navigate("/settings");
            }}
          >
            Settings
          </button>
          <hr className="profile-menu-divider" />
          <button
            type="button"
            className="profile-menu-item profile-menu-item--danger"
            onClick={() => {
              setOpen(false);
              signOut({ redirectUrl: "/sign-in" });
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

interface DashboardContentProps {
  companyName?: string;
  logoUrl?: string;
  projectCards: DashboardProjectCardData[];
  welcomeName?: string;
  isDataLoading: boolean;
  initials?: string;
}

function DashboardContent({
  companyName,
  logoUrl,
  projectCards,
  welcomeName,
  isDataLoading,
  initials,
}: DashboardContentProps) {
  const navigate = useNavigate();
  const welcomeHeading = welcomeName
    ? `Welcome back, ${welcomeName}`
    : "Welcome back";

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
              <img
                src={logoUrl}
                alt="Builder logo"
                className="dashboard-logo"
              />
            ) : (
              <div className="dashboard-logo-placeholder" aria-hidden>
                BQ
              </div>
            )}
            <div className="dashboard-brand-copy">
              {companyName ? (
                <strong className="dashboard-brand-title">{companyName}</strong>
              ) : (
                <strong className="dashboard-brand-title">BuildQuote</strong>
              )}
              {companyName ? (
                <span className="dashboard-brand-subtitle">BuildQuote</span>
              ) : null}
            </div>
          </div>

          <div className="dashboard-header-copy">
            <h1>{welcomeHeading}</h1>
          </div>
        </div>

        <div className="dashboard-header-right">
          <nav className="dashboard-top-nav" aria-label="Dashboard sections">
            <Button
              to="/dashboard"
              variant="secondary"
              className="dashboard-nav-item is-active"
            >
              Projects
            </Button>
            <Button
              to="/suppliers"
              variant="secondary"
              className="dashboard-nav-item"
            >
              Suppliers
            </Button>
            <Button
              to="/library"
              variant="secondary"
              className="dashboard-nav-item"
            >
              Library
            </Button>
            <Button
              to="/profile"
              variant="secondary"
              className="dashboard-nav-item"
            >
              Profile
            </Button>
          </nav>
          <ProfileMenu initials={initials || "BQ"} logoUrl={logoUrl} />
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
            <p className="hint">
              No projects yet. Start a new project to begin.
            </p>
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

  const initials = welcomeName
    ? welcomeName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "BQ";

  return (
    <DashboardContent
      companyName={companyName}
      logoUrl={logoUrl}
      projectCards={projectCards}
      welcomeName={welcomeName}
      isDataLoading={isDataLoading}
      initials={initials}
    />
  );
}

function FallbackDashboardScreen() {
  return (
    <DashboardContent projectCards={FALLBACK_PROJECTS} isDataLoading={false} />
  );
}

export function DashboardScreen() {
  if (hasClerk && hasConvex) {
    return <ConnectedDashboardScreen />;
  }
  return <FallbackDashboardScreen />;
}
