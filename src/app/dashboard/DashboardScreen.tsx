// S1 — Builder Dashboard
// READS: builders, projects, supplierRFQs (summary)
// WRITES: none
// AI RULES: no AI suggestions, no interpretation, no automation

import { useNavigate } from "react-router-dom";

export function DashboardScreen() {
  const navigate = useNavigate();

  return (
    <div className="screen dashboard">
      <header>
        <h1>Welcome back</h1>
        {/* TODO: builder name from auth context */}
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
        {/* TODO: scrollable project tile grid */}
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
