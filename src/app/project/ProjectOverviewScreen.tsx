// S3b — Project Overview
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export function ProjectOverviewScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const typedId = projectId as Id<"projects">;
  const project = useQuery(api.projects.getProject, { projectId: typedId });
  const quotes = useQuery(api.quoteRequests.listByProject, { projectId: typedId });

  if (project === undefined) {
    return <div className="screen"><p className="hint">Loading project...</p></div>;
  }

  if (!project) {
    return (
      <div className="screen">
        <p className="hint">Project not found.</p>
        <Button to="/dashboard">Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="screen project-overview">
      <header>
        <Button variant="secondary" onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </Button>
        <h2>{project.name}</h2>
      </header>

      <Card>
        <div className="project-overview-details">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={`${project.name} site photo`}
              className="project-overview-image"
            />
          ) : null}
          <p><strong>Address:</strong> {project.siteAddress ?? "Not set"}</p>
          {project.setupStage ? (
            <p><strong>Stage:</strong> {project.setupCustomStageLabel || project.setupStage}</p>
          ) : null}
          {project.builderNotes ? (
            <p><strong>Notes:</strong> {project.builderNotes}</p>
          ) : null}
          <p>
            <strong>Status:</strong>{" "}
            <span className={`bq-badge ${project.status === "draft" ? "bq-badge--warning" : "bq-badge--success"}`}>
              {project.status === "draft" ? "Draft" : "Active"}
            </span>
          </p>
        </div>
      </Card>

      <div className="primary-actions">
        <Button onClick={() => navigate(`/projects/${projectId}/stages`)}>
          New Quote Request
        </Button>
        <Button variant="secondary" onClick={() => navigate(`/projects/${projectId}/edit`)}>
          Edit Project
        </Button>
      </div>

      {quotes && quotes.length > 0 ? (
        <section className="project-tiles">
          <h3>Quote Requests</h3>
          <div className="project-card-list">
            {quotes.map((quote) => (
              <Card key={quote._id} compact className="project-card project-card--clickable"
                role="button" tabIndex={0}
                onClick={() => navigate(`/projects/${projectId}/preview`)}
              >
                <div className="project-card-meta">
                  <strong>{quote.customStageLabel || quote.stage}</strong>
                  <div className="project-card-badges">
                    <span className={`bq-badge ${quote.status === "draft" ? "bq-badge--warning" : "bq-badge--success"}`}>
                      {quote.status === "draft" ? "Draft" : "Sent"}
                    </span>
                  </div>
                </div>
                <span className="project-card-chevron" aria-hidden>{">"}</span>
              </Card>
            ))}
          </div>
        </section>
      ) : (
        <Card compact className="dashboard-empty">
          <p className="hint">No quote requests yet. Start a new quote request to begin.</p>
        </Card>
      )}
    </div>
  );
}
