// S1 — Builder Dashboard
// READS: builders, projects, supplierRFQs (summary)
// WRITES: none
// AI RULES: no AI suggestions, no interpretation, no automation

import { useNavigate } from "react-router-dom";

export function DashboardScreen() {
  const navigate = useNavigate();

  // TODO: get builder from auth context once Clerk + Convex are wired
  const builder = null as any;

  return (
    <div className="screen dashboard">
      <header className="dashboard-header">
        {builder?.logoUrl && (
          <img
            src={builder.logoUrl}
            alt={`${builder.companyName} logo`}
            className="dashboard-logo"
          />
        )}
        <div>
          <h1>Welcome back</h1>
          {builder?.companyName && (
            <p className="hint">{builder.companyName}</p>
          )}
        </div>
        <button
          className="btn secondary btn-sm settings-link"
          onClick={() => navigate("/settings")}
        >
          Settings
        </button>
      </header>

      <div className="primary-actions">
        <button className="btn primary" onClick={() => navigate("/project/new")}>
          New project
        </button>
        <button className="btn secondary" onClick={() => navigate("/project/new")}>
          Add to existing project
        </button>
      </div>

      <section className="project-tiles">
        <h2>Projects</h2>
        {/* TODO: scrollable project tile grid with thumbnails */}
      </section>

      <section className="sandbox">
        <h3>Sandbox</h3>
        <p className="hint">
          Sandbox (practice — suppliers will not be contacted)
        </p>
      </section>

      <section className="archived-projects">
        <details>
          <summary>Archived projects</summary>
          {/* TODO: read-only archived project list */}
        </details>
      </section>
    </div>
  );
}
