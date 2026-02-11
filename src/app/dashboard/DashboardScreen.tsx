// S1 - Builder Dashboard
// OWNS: landing orchestration, project visibility, and next actions.
// DOES NOT DECIDE: RFQ content, material selection, compliance, or supplier outcomes.
// READS: builders, projects, supplierRFQs (summary)
// WRITES: none
// AI RULES: no AI suggestions, no interpretation, no automation

import { Link, useNavigate } from "react-router-dom";

const ACTIVE_PROJECTS = [
  {
    id: "p-1",
    name: "Smith Residence",
    suburb: "Dunsborough",
    stages: ["Decking / Pergola / Outdoor Structures"],
    rfq: { sent: 2, willQuote: 1, cantQuote: 0, pending: 1 },
  },
  {
    id: "p-2",
    name: "Yallingup Rd Extension",
    suburb: "Yallingup",
    stages: ["Wall Framing", "External Cladding"],
    rfq: { sent: 1, willQuote: 0, cantQuote: 1, pending: 0 },
  },
];

const ARCHIVED_PROJECTS = [
  {
    id: "a-1",
    name: "Southwest Constructions Display Unit",
    suburb: "Busselton",
    stage: "Roofing",
  },
];

export function DashboardScreen() {
  const navigate = useNavigate();

  const builder = {
    firstName: "Sam",
    companyName: "Southwest Constructions",
    logoUrl: "",
  };

  const activeQuoteRequests = ACTIVE_PROJECTS.reduce(
    (count, project) => count + project.rfq.sent + project.rfq.pending,
    0
  );

  return (
    <div className="screen dashboard">
      <header className="dashboard-header">
        {builder.logoUrl && (
          <img
            src={builder.logoUrl}
            alt={`${builder.companyName} logo`}
            className="dashboard-logo"
          />
        )}
        <div>
          <h1>Welcome back, {builder.firstName}</h1>
          <p className="hint">You have {activeQuoteRequests} active quote requests.</p>
        </div>
        <button
          className="btn secondary btn-sm settings-link"
          type="button"
          onClick={() => navigate("/settings")}
        >
          Settings
        </button>
      </header>

      <div className="primary-actions">
        <Link className="btn primary" to="/project/new">
          New project
        </Link>
        <Link className="btn secondary" to="/project/existing">
          Add to existing project
        </Link>
      </div>

      <section className="project-tiles">
        <h2>Projects</h2>
        <div className="project-tiles-grid">
          {ACTIVE_PROJECTS.map((project) => (
            <article key={project.id} className="project-tile">
              <h3>{project.name}</h3>
              <p className="hint">{project.suburb}</p>
              <p className="hint">{project.stages.join(" • ")}</p>
              <dl>
                <div>
                  <dt>Sent</dt>
                  <dd>{project.rfq.sent}</dd>
                </div>
                <div>
                  <dt>Will quote</dt>
                  <dd>{project.rfq.willQuote}</dd>
                </div>
                <div>
                  <dt>Can’t quote</dt>
                  <dd>{project.rfq.cantQuote}</dd>
                </div>
                <div>
                  <dt>Pending</dt>
                  <dd>{project.rfq.pending}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="sandbox project-tile sandbox-tile">
        <h3>Sandbox</h3>
        <p className="hint">Sandbox (practice — suppliers will not be contacted)</p>
        <ul>
          <li>Guided hint copy enabled</li>
          <li>Example scopes available</li>
          <li>Dummy suppliers included</li>
        </ul>
      </section>

      <section className="archived-projects">
        <details>
          <summary>Archived projects</summary>
          <ul className="archived-list">
            {ARCHIVED_PROJECTS.map((project) => (
              <li key={project.id}>
                <strong>{project.name}</strong> — {project.suburb} ({project.stage})
              </li>
            ))}
          </ul>
        </details>
      </section>
    </div>
  );
}
