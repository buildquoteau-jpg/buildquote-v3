// S1 - Builder Dashboard
// OWNS: landing orchestration, project visibility, and next actions.
// DOES NOT DECIDE: RFQ content, material selection, compliance, or supplier outcomes.

import { Link, NavLink, useNavigate } from "react-router-dom";
import { Badge, Button, Card } from "../../components/ui";

const ACTIVE_PROJECTS = [
  {
    id: "p-1",
    name: "Smith Residence",
    suburb: "Dunsborough",
    stages: ["Decking / Pergola / Outdoor Structures"],
    rfq: { sent: 2, willQuote: 1, cantQuote: 0, pending: 1 },
  },
];

export function DashboardScreen() {
  const navigate = useNavigate();
  const builder = {
    firstName: "Sam",
    companyName: "Southwest Constructions",
    logoUrl: "",
  };

  return (
    <div className="screen dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Welcome back, {builder.firstName}</h1>
          <p className="bq-hint">You have 4 active quote requests.</p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/settings")}>Settings</Button>
      </header>

      <nav className="dashboard-nav" aria-label="Builder dashboard sections">
        <NavLink to="/" end className="dashboard-nav-link">Projects</NavLink>
        <NavLink to="/builder-profile" className="dashboard-nav-link">Builder Profile</NavLink>
        <NavLink to="/builder-library" className="dashboard-nav-link">Builder Library</NavLink>
        <NavLink to="/supplier-library" className="dashboard-nav-link">Supplier Library</NavLink>
        <NavLink to="/settings" className="dashboard-nav-link">Settings</NavLink>
      </nav>

      <div className="primary-actions">
        <Link className="bq-button bq-button--primary" to="/project/new">New project</Link>
        <Link className="bq-button bq-button--secondary" to="/project/existing">Add to existing project</Link>
      </div>

      <section className="project-tiles">
        <h2>Projects</h2>
        <div className="project-tiles-grid">
          {ACTIVE_PROJECTS.map((project) => (
            <Card key={project.id} className="project-tile">
              <h3>{project.name}</h3>
              <p className="bq-hint">{project.suburb}</p>
              <p className="bq-hint">{project.stages.join(" • ")}</p>
              <div className="tile-badges">
                <Badge>Sent {project.rfq.sent}</Badge>
                <Badge>Will quote {project.rfq.willQuote}</Badge>
                <Badge>Can’t quote {project.rfq.cantQuote}</Badge>
                <Badge>Pending {project.rfq.pending}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Card className="sandbox-tile">
        <h3>Sandbox</h3>
        <p className="bq-hint">Sandbox (practice — suppliers will not be contacted)</p>
      </Card>
    </div>
  );
}
