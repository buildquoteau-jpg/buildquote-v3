// A0 — Admin Review Queue
// READS: manufacturerSystems (pending), referenceDocuments (pending)
// WRITES: approve/reject both

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import "./admin.css";

export function ReviewQueueScreen() {
  const navigate = useNavigate();
  const pending = useQuery(api.adminApprovals.listPending);
  const approveSystem = useMutation(
    api.adminApprovals.approveManufacturerSystem
  );
  const rejectSystem = useMutation(
    api.adminApprovals.rejectManufacturerSystem
  );
  const approveDoc = useMutation(api.adminApprovals.approveReferenceDoc);
  const rejectDoc = useMutation(api.adminApprovals.rejectReferenceDoc);

  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>(
    {}
  );
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (pending === undefined) {
    return <div className="screen">Loading review queue…</div>;
  }

  const handleApproveSystem = async (id: string) => {
    setProcessing(id);
    setError(null);
    try {
      await approveSystem({ id: id as any });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approve failed");
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectSystem = async (id: string) => {
    const reason = rejectReasons[id]?.trim();
    if (!reason) {
      setError("Please enter a rejection reason.");
      return;
    }
    setProcessing(id);
    setError(null);
    try {
      await rejectSystem({ id: id as any, reason });
      setRejectReasons((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reject failed");
    } finally {
      setProcessing(null);
    }
  };

  const handleApproveDoc = async (id: string) => {
    setProcessing(id);
    setError(null);
    try {
      await approveDoc({ id: id as any });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approve failed");
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectDoc = async (id: string) => {
    const reason = rejectReasons[id]?.trim();
    if (!reason) {
      setError("Please enter a rejection reason.");
      return;
    }
    setProcessing(id);
    setError(null);
    try {
      await rejectDoc({ id: id as any, reason });
      setRejectReasons((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reject failed");
    } finally {
      setProcessing(null);
    }
  };

  const totalPending =
    pending.systems.length + pending.documents.length;

  return (
    <div className="screen admin-review-queue">
      <header>
        <button className="btn secondary" onClick={() => navigate("/")}>
          ← Home
        </button>
        <h2>Admin Review Queue</h2>
        <span className="queue-count">{totalPending} pending</span>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {totalPending === 0 && (
        <p className="hint">No items pending review. All clear!</p>
      )}

      {/* ── Pending System Mappings ── */}
      {pending.systems.length > 0 && (
        <section>
          <h3>System Mappings ({pending.systems.length})</h3>
          <ul className="review-list">
            {pending.systems.map((s: any) => (
              <li key={s._id} className="review-card">
                <div className="review-card-header">
                  <strong>{s.marketedName}</strong>
                  <span className="hint">{s._manufacturerName}</span>
                </div>
                <p className="hint">
                  Global system: {s._systemName}
                  {s.isPrimarySupplier && " • Primary supplier"}
                </p>
                <div className="review-actions">
                  <button
                    className="btn primary btn-sm"
                    onClick={() => handleApproveSystem(s._id)}
                    disabled={processing === s._id}
                  >
                    Approve
                  </button>
                  <div className="reject-group">
                    <input
                      type="text"
                      placeholder="Rejection reason…"
                      value={rejectReasons[s._id] ?? ""}
                      onChange={(e) =>
                        setRejectReasons((prev) => ({
                          ...prev,
                          [s._id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      className="btn danger btn-sm"
                      onClick={() => handleRejectSystem(s._id)}
                      disabled={processing === s._id}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Pending Reference Documents ── */}
      {pending.documents.length > 0 && (
        <section>
          <h3>Reference Documents ({pending.documents.length})</h3>
          <ul className="review-list">
            {pending.documents.map((d: any) => (
              <li key={d._id} className="review-card">
                <div className="review-card-header">
                  <strong>{d.title}</strong>
                  <span className="hint">{d._manufacturerName}</span>
                </div>
                <p className="hint">
                  {d.docType}
                  {d._systemName && ` • ${d._systemName}`}
                  {d.version && ` • v${d.version}`}
                </p>
                <span className="advisory-tag">Advisory only</span>
                <div className="review-actions">
                  <button
                    className="btn primary btn-sm"
                    onClick={() => handleApproveDoc(d._id)}
                    disabled={processing === d._id}
                  >
                    Approve
                  </button>
                  <div className="reject-group">
                    <input
                      type="text"
                      placeholder="Rejection reason…"
                      value={rejectReasons[d._id] ?? ""}
                      onChange={(e) =>
                        setRejectReasons((prev) => ({
                          ...prev,
                          [d._id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      className="btn danger btn-sm"
                      onClick={() => handleRejectDoc(d._id)}
                      disabled={processing === d._id}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
