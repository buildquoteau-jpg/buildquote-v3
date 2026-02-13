// S9 — Request for Quotation – Preview (read-only PDF-style)
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useBuilderAccount } from "../hooks/useBuilderAccount";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StickyFooter } from "../../components/ui/StickyFooter";

export function RfqPreviewScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const stage = searchParams.get("stage") ?? "";

  const { builder } = useBuilderAccount();
  const project = useQuery(
    api.projects.getProject,
    projectId ? { projectId: projectId as never } : "skip",
  );

  const handleSend = () => {
    navigate(`/projects/${projectId}/tracking`);
  };

  const companyName =
    builder?.companyName && builder.companyName !== "BuildQuote Builder"
      ? builder.companyName
      : "";
  const builderName = [builder?.firstName, builder?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="screen rfq-preview-screen">
      <header>
        <Button
          variant="secondary"
          onClick={() =>
            navigate(
              `/projects/${projectId}/review?stage=${encodeURIComponent(stage)}`,
            )
          }
        >
          ← Back to Review
        </Button>
        <h2>Request for Quotation – Preview</h2>
      </header>

      {/* Builder identity */}
      <Card className="rfq-preview">
        <div className="rfq-preview-header">
          {builder?.logoUrl ? (
            <img
              src={builder.logoUrl}
              alt="Company logo"
              className="rfq-preview-logo"
            />
          ) : null}
          <div>
            {companyName && <strong>{companyName}</strong>}
            {builderName && <p className="hint">{builderName}</p>}
            {builder?.businessEmail && (
              <p className="hint">{builder.businessEmail}</p>
            )}
            {!builder?.businessEmail && builder?.email && (
              <p className="hint">{builder.email}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Project details */}
      <Card>
        <h3>Project Details</h3>
        <table className="rfq-detail-table">
          <tbody>
            <tr>
              <td className="hint">Project</td>
              <td>{project?.name ?? "—"}</td>
            </tr>
            <tr>
              <td className="hint">Site Address</td>
              <td>{project?.siteAddress ?? "—"}</td>
            </tr>
            <tr>
              <td className="hint">Stage</td>
              <td>{stage || "—"}</td>
            </tr>
          </tbody>
        </table>
      </Card>

      {/* Scope */}
      <Card>
        <h3>Scope of Works</h3>
        <p>{project?.builderNotes || "No scope details entered."}</p>
      </Card>

      {/* Structured Materials */}
      <Card>
        <h3>Structured Materials List</h3>
        <p className="hint">
          Materials and quantities from the line item selection will appear here
          once persisted to the database.
        </p>
      </Card>

      <StickyFooter>
        <Button
          variant="secondary"
          onClick={() =>
            navigate(
              `/projects/${projectId}/review?stage=${encodeURIComponent(stage)}`,
            )
          }
        >
          Back to Review
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate(`/projects/${projectId}`)}
        >
          Save Draft
        </Button>
        <Button onClick={handleSend}>Send Request</Button>
      </StickyFooter>
    </div>
  );
}
