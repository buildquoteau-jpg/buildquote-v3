// M1 — Manufacturer Systems List
// READS: manufacturerSystems (own), systems (global names)
// WRITES: none

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import "../manufacturer.css";

type StatusFilter = "all" | "draft" | "pending_review" | "approved" | "rejected";

export function ManufacturerSystemsListScreen() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const systems = useQuery(api.manufacturerPortal.listMySystemMappings, {});
  const globalSystems = useQuery(
    api.manufacturerPortal.listApprovedGlobalSystems
  );

  if (systems === undefined) {
    return <div className="screen">Loading…</div>;
  }

  const filtered =
    filter === "all" ? systems : systems.filter((s: any) => s.status === filter);

  // Build a lookup for global system names
  const systemNameMap = new Map<string, string>();
  globalSystems?.forEach((gs: any) => {
    systemNameMap.set(gs._id, gs.nameGeneric);
  });

  return (
    <div className="screen mfg-systems-list">
      <header>
        <button className="btn secondary" onClick={() => navigate("/manufacturer")}>
          ← Dashboard
        </button>
        <h2>System Mappings</h2>
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
        onClick={() => navigate("/manufacturer/systems/new")}
      >
        + New system mapping
      </button>

      {filtered.length === 0 ? (
        <p className="hint">No system mappings found.</p>
      ) : (
        <ul className="item-list">
          {filtered.map((s: any) => (
            <li
              key={s._id}
              className="item-card"
              onClick={() => navigate(`/manufacturer/systems/${s._id}`)}
            >
              <div className="item-card-header">
                <strong>{s.marketedName}</strong>
                <span className={`status-badge status-${s.status}`}>
                  {s.status === "pending_review" ? "Pending" : s.status}
                </span>
              </div>
              <p className="hint">
                {systemNameMap.get(s.systemId) ?? "Loading system…"}
              </p>
              {s.status === "rejected" && s.rejectionReason && (
                <p className="rejection-reason">
                  Rejected: {s.rejectionReason}
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
