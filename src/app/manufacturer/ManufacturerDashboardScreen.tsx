// M0 — Manufacturer Dashboard
// READS: manufacturers, manufacturerSystems, referenceDocuments (own)
// WRITES: none

import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import "./manufacturer.css";

export function ManufacturerDashboardScreen() {
  const navigate = useNavigate();
  const manufacturer = useQuery(api.manufacturerPortal.myManufacturer);
  const systems = useQuery(api.manufacturerPortal.listMySystemMappings, {});
  const documents = useQuery(api.manufacturerPortal.listMyDocuments, {});

  if (manufacturer === undefined) {
    return <div className="screen manufacturer-dashboard">Loading…</div>;
  }

  if (manufacturer === null) {
    return (
      <div className="screen manufacturer-dashboard">
        <h1>No manufacturer account found</h1>
        <p className="hint">
          Contact BuildQuote admin to set up your manufacturer account.
        </p>
      </div>
    );
  }

  const draftSystems = systems?.filter((s: any) => s.status === "draft").length ?? 0;
  const pendingSystems =
    systems?.filter((s: any) => s.status === "pending_review").length ?? 0;
  const approvedSystems =
    systems?.filter((s: any) => s.status === "approved").length ?? 0;
  const rejectedSystems =
    systems?.filter((s: any) => s.status === "rejected").length ?? 0;

  const draftDocs = documents?.filter((d: any) => d.status === "draft").length ?? 0;
  const pendingDocs =
    documents?.filter((d: any) => d.status === "pending_review").length ?? 0;
  const approvedDocs =
    documents?.filter((d: any) => d.status === "approved").length ?? 0;

  return (
    <div className="screen manufacturer-dashboard">
      <header>
        <h1>{manufacturer.name}</h1>
        <span className={`status-badge status-${manufacturer.status}`}>
          {manufacturer.status}
        </span>
      </header>

      {manufacturer.website && (
        <p className="hint">{manufacturer.website}</p>
      )}

      <div className="dashboard-cards">
        <button
          className="dashboard-card"
          onClick={() => navigate("/manufacturer/systems")}
        >
          <h3>System Mappings</h3>
          <div className="card-stats">
            <span>{draftSystems} draft</span>
            <span>{pendingSystems} pending</span>
            <span>{approvedSystems} approved</span>
            {rejectedSystems > 0 && (
              <span className="rejected">{rejectedSystems} rejected</span>
            )}
          </div>
        </button>

        <button
          className="dashboard-card"
          onClick={() => navigate("/manufacturer/documents")}
        >
          <h3>Reference Documents</h3>
          <div className="card-stats">
            <span>{draftDocs} draft</span>
            <span>{pendingDocs} pending</span>
            <span>{approvedDocs} approved</span>
          </div>
        </button>
      </div>

      <div className="advisory-banner">
        All content is advisory only — not a substitute for professional advice.
      </div>
    </div>
  );
}
