// S1 - Builder Dashboard
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const MOCK_PROJECTS = [
  {
    id: "p1",
    name: "Smith Residence",
    stage: "Framing",
    projectPhotoUrl: "",
  },
  {
    id: "p2",
    name: "Garden Studio",
    stage: "Decking",
    projectPhotoUrl: "",
  },
];

export function DashboardScreen() {
  const navigate = useNavigate();

  // TODO: get builder from auth context once Clerk + Convex are wired
  const builder: { logoUrl?: string; companyName?: string } | null = null;

  return (
    <div className="screen dashboard">
      <header className="dashboard-header">
        {builder?.logoUrl ? (
          <img
            src={builder.logoUrl}
            alt={`${builder.companyName} logo`}
            className="dashboard-logo"
          />
        ) : (
          <div className="dashboard-logo-placeholder" aria-hidden />
        )}
        <div>
          <h1>Welcome back</h1>
          {builder?.companyName && <p className="hint">{builder.companyName}</p>}
        </div>
        <Button variant="secondary" type="button" onClick={() => navigate("/settings")}>
          Settings
        </Button>
      </header>

      <div className="primary-actions">
        <Button to="/project/new">New project</Button>
        <Button variant="secondary" to="/project/existing">
          Add to existing project
        </Button>
      </div>

      <section className="project-tiles">
        <h2>Projects</h2>
        <div className="project-card-list">
          {MOCK_PROJECTS.map((project) => (
            <Card key={project.id} className="project-card" compact>
              {project.projectPhotoUrl ? (
                <img
                  src={project.projectPhotoUrl}
                  alt={`${project.name} site photo`}
                  className="project-card-thumb"
                />
              ) : (
                <div className="project-card-thumb-placeholder" aria-hidden />
              )}
              <div className="project-card-meta">
                <strong>{project.name}</strong>
                <span className="bq-badge bq-badge--neutral">{project.stage}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Card className="sandbox" compact>
        <h3>Sandbox</h3>
        <p className="hint">Sandbox (practice - suppliers will not be contacted)</p>
      </Card>
    </div>
  );
}
