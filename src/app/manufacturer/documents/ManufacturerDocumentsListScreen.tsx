// M4 — Manufacturer Documents List
// READS: referenceDocuments (own)
// WRITES: none

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import "../manufacturer.css";

type StatusFilter = "all" | "draft" | "pending_review" | "approved" | "rejected";

export function ManufacturerDocumentsListScreen() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const documents = useQuery(api.manufacturerPortal.listMyDocuments, {});

  if (documents === undefined) {
    return <div className="screen">Loading…</div>;
  }

  const filtered =
    filter === "all" ? documents : documents.filter((d: any) => d.status === filter);

  return (
    <div className="screen mfg-documents-list">
      <header>
        <button
          className="btn secondary"
          onClick={() => navigate("/manufacturer")}
        >
          ← Dashboard
        </button>
        <h2>Reference Documents</h2>
      </header>

      <div className="filter-bar">
        {(["all", "draft", "pending_review", "approved", "rejected"] as const).map(
          (s) => (
            <button
              key={s}
              className={`filter-pill ${filter === s ? "selected" : ""}`}
              onClick={() => setFilter(s)}
            >
              {s === "pending_review" ? "Pending" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          )
        )}
      </div>

      <button
        className="btn primary"
        onClick={() => navigate("/manufacturer/documents/upload")}
      >
        + Upload Document
      </button>

      {filtered.length === 0 ? (
        <p className="hint">No documents found.</p>
      ) : (
        <ul className="item-list">
          {filtered.map((d: any) => (
            <li key={d._id} className="item-card">
              <div className="item-card-header">
                <strong>{d.title}</strong>
                <span className={`status-badge status-${d.status}`}>
                  {d.status === "pending_review" ? "Pending" : d.status}
                </span>
              </div>
              <p className="hint">
                {d.docType} • {d.source === "manufacturer_pdf" ? "PDF" : "Standard"}
                {d.version && ` • v${d.version}`}
              </p>
              <span className="advisory-tag">Advisory only</span>
              {d.status === "rejected" && d.rejectionReason && (
                <p className="rejection-reason">
                  Rejected: {d.rejectionReason}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="advisory-banner">
        All content is advisory only — not a substitute for professional advice.
      </div>
    </div>
  );
}
