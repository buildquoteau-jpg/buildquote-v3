// M2 — New Manufacturer System Mapping
// READS: systems (global approved)
// WRITES: manufacturerSystems (create draft)

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import "../manufacturer.css";

export function NewManufacturerSystemScreen() {
  const navigate = useNavigate();
  const globalSystems = useQuery(
    api.manufacturerPortal.listApprovedGlobalSystems
  );
  const createDraft = useMutation(
    api.manufacturerPortal.createSystemMappingDraft
  );

  const [selectedSystemId, setSelectedSystemId] = useState("");
  const [marketedName, setMarketedName] = useState("");
  const [isPrimarySupplier, setIsPrimarySupplier] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!selectedSystemId || !marketedName.trim()) {
      setError("Please select a system and enter your marketed name.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createDraft({
        systemId: selectedSystemId as Id<"systems">,
        marketedName: marketedName.trim(),
        isPrimarySupplier,
      });
      navigate("/manufacturer/systems");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create draft");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="screen mfg-new-system">
      <header>
        <button
          className="btn secondary"
          onClick={() => navigate("/manufacturer/systems")}
        >
          ← Back
        </button>
        <h2>New System Mapping</h2>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="field">
        <label>Global System</label>
        {globalSystems === undefined ? (
          <p className="hint">Loading systems…</p>
        ) : globalSystems.length === 0 ? (
          <p className="hint">No approved global systems available yet.</p>
        ) : (
          <select
            value={selectedSystemId}
            onChange={(e) => setSelectedSystemId(e.target.value)}
          >
            <option value="">Select a system…</option>
            {globalSystems.map((gs: any) => (
              <option key={gs._id} value={gs._id}>
                {gs.nameGeneric}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="field">
        <label>Your Marketed Name</label>
        <input
          type="text"
          placeholder="e.g. James Hardie Oblique Cladding System"
          value={marketedName}
          onChange={(e) => setMarketedName(e.target.value)}
        />
      </div>

      <div className="field checkbox-field">
        <label>
          <input
            type="checkbox"
            checked={isPrimarySupplier}
            onChange={(e) => setIsPrimarySupplier(e.target.checked)}
          />
          We are a primary supplier of this system
        </label>
      </div>

      <div className="form-actions">
        <button className="btn primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save as Draft"}
        </button>
      </div>

      <div className="advisory-banner">
        All content is advisory only — not a substitute for professional advice.
      </div>
    </div>
  );
}
