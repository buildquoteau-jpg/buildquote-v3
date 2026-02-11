// M3 — Manufacturer System Detail (view/edit draft, submit for review)
// READS: manufacturerSystems (own)
// WRITES: manufacturerSystems (update draft, submit)

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import "../manufacturer.css";

export function ManufacturerSystemDetailScreen() {
  const navigate = useNavigate();
  const { systemMappingId } = useParams<{ systemMappingId: string }>();
  const systems = useQuery(api.manufacturerPortal.listMySystemMappings, {});
  const globalSystems = useQuery(
    api.manufacturerPortal.listApprovedGlobalSystems
  );
  const updateDraft = useMutation(
    api.manufacturerPortal.updateSystemMappingDraft
  );
  const submitForReview = useMutation(
    api.manufacturerPortal.submitSystemMappingForReview
  );

  const mapping = systems?.find((s: any) => s._id === systemMappingId);
  const globalSystem = globalSystems?.find(
    (gs: any) => gs._id === mapping?.systemId
  );

  const [marketedName, setMarketedName] = useState("");
  const [isPrimarySupplier, setIsPrimarySupplier] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mapping) {
      setMarketedName(mapping.marketedName);
      setIsPrimarySupplier(mapping.isPrimarySupplier);
    }
  }, [mapping]);

  if (systems === undefined) {
    return <div className="screen">Loading…</div>;
  }
  if (!mapping) {
    return (
      <div className="screen">
        <p>System mapping not found.</p>
        <button
          className="btn secondary"
          onClick={() => navigate("/manufacturer/systems")}
        >
          ← Back
        </button>
      </div>
    );
  }

  const editable = mapping.status === "draft" || mapping.status === "rejected";

  const handleUpdate = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateDraft({
        manufacturerSystemId: systemMappingId as Id<"manufacturerSystems">,
        marketedName: marketedName.trim(),
        isPrimarySupplier,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      // Save any pending changes first
      if (editable) {
        await updateDraft({
          manufacturerSystemId: systemMappingId as Id<"manufacturerSystems">,
          marketedName: marketedName.trim(),
          isPrimarySupplier,
        });
      }
      await submitForReview({
        manufacturerSystemId: systemMappingId as Id<"manufacturerSystems">,
      });
      navigate("/manufacturer/systems");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="screen mfg-system-detail">
      <header>
        <button
          className="btn secondary"
          onClick={() => navigate("/manufacturer/systems")}
        >
          ← Back
        </button>
        <h2>System Mapping Detail</h2>
        <span className={`status-badge status-${mapping.status}`}>
          {mapping.status === "pending_review" ? "Pending Review" : mapping.status}
        </span>
      </header>

      {mapping.status === "rejected" && mapping.rejectionReason && (
        <div className="rejection-banner">
          <strong>Rejected:</strong> {mapping.rejectionReason}
          <p className="hint">Edit and resubmit below.</p>
        </div>
      )}

      {error && <div className="error-banner">{error}</div>}

      <div className="field">
        <label>Global System</label>
        <p>{globalSystem?.nameGeneric ?? "Loading…"}</p>
      </div>

      <div className="field">
        <label>Your Marketed Name</label>
        {editable ? (
          <input
            type="text"
            value={marketedName}
            onChange={(e) => setMarketedName(e.target.value)}
          />
        ) : (
          <p>{mapping.marketedName}</p>
        )}
      </div>

      <div className="field checkbox-field">
        <label>
          <input
            type="checkbox"
            checked={isPrimarySupplier}
            onChange={(e) => setIsPrimarySupplier(e.target.checked)}
            disabled={!editable}
          />
          Primary supplier of this system
        </label>
      </div>

      {editable && (
        <div className="form-actions">
          <button
            className="btn secondary"
            onClick={handleUpdate}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button
            className="btn primary"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Submitting…" : "Submit for Review"}
          </button>
        </div>
      )}

      {mapping.status === "approved" && (
        <div className="approved-banner">
          This system mapping has been approved and is visible to builders.
        </div>
      )}

      <div className="advisory-banner">
        All content is advisory only — not a substitute for professional advice.
      </div>
    </div>
  );
}
