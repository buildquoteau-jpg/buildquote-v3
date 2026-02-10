// M5 — Manufacturer Document Upload
// READS: systems (global approved), manufacturers (own)
// WRITES: referenceDocuments (create draft + submit)

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { generateR2Key, uploadToR2 } from "../../../lib/r2Upload";
import "../manufacturer.css";

type DocType = "installation" | "technical" | "span_table" | "standard";

export function ManufacturerDocumentUploadScreen() {
  const navigate = useNavigate();
  const manufacturer = useQuery(api.manufacturerPortal.myManufacturer);
  const globalSystems = useQuery(
    api.manufacturerPortal.listApprovedGlobalSystems
  );
  const createDraft = useMutation(
    api.manufacturerPortal.createReferenceDocDraft
  );
  const submitForReview = useMutation(
    api.manufacturerPortal.submitReferenceDocForReview
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState<DocType>("installation");
  const [systemId, setSystemId] = useState("");
  const [version, setVersion] = useState("");
  const [r2KeyManual, setR2KeyManual] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<"file" | "manual">("file");

  const handleSaveDraft = async (andSubmit: boolean) => {
    if (!title.trim()) {
      setError("Please enter a document title.");
      return;
    }

    let finalR2Key = r2KeyManual.trim();

    if (uploadMode === "file") {
      if (!selectedFile) {
        setError("Please select a file to upload.");
        return;
      }
      if (!manufacturer) {
        setError("Manufacturer account not loaded.");
        return;
      }
      // Try uploading to R2
      const key = generateR2Key(manufacturer._id, selectedFile.name);
      const result = await uploadToR2(selectedFile, key);
      if (result) {
        finalR2Key = result.r2Key;
      } else {
        // Fallback: use the generated key as placeholder
        finalR2Key = key;
      }
    }

    if (!finalR2Key) {
      setError("Please provide an R2 key or select a file.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const docId = await createDraft({
        systemId: systemId ? (systemId as Id<"systems">) : undefined,
        docType,
        source: "manufacturer_pdf",
        title: title.trim(),
        version: version.trim() || undefined,
        r2Key: finalR2Key,
      });

      if (andSubmit) {
        await submitForReview({ referenceDocumentId: docId });
      }
      navigate("/manufacturer/documents");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="screen mfg-doc-upload">
      <header>
        <button
          className="btn secondary"
          onClick={() => navigate("/manufacturer/documents")}
        >
          ← Back
        </button>
        <h2>Upload Reference Document</h2>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="field">
        <label>Document Title</label>
        <input
          type="text"
          placeholder="e.g. Installation Guide — Oblique Cladding"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Document Type</label>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value as DocType)}
        >
          <option value="installation">Installation Guide</option>
          <option value="technical">Technical Data</option>
          <option value="span_table">Span Table</option>
          <option value="standard">Standard</option>
        </select>
      </div>

      <div className="field">
        <label>Related System (optional)</label>
        {globalSystems === undefined ? (
          <p className="hint">Loading…</p>
        ) : (
          <select
            value={systemId}
            onChange={(e) => setSystemId(e.target.value)}
          >
            <option value="">None</option>
            {globalSystems.map((gs: any) => (
              <option key={gs._id} value={gs._id}>
                {gs.nameGeneric}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="field">
        <label>Version (optional)</label>
        <input
          type="text"
          placeholder="e.g. 2.1"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Upload Method</label>
        <div className="toggle-group">
          <button
            className={`toggle-btn ${uploadMode === "file" ? "selected" : ""}`}
            onClick={() => setUploadMode("file")}
          >
            File Upload
          </button>
          <button
            className={`toggle-btn ${uploadMode === "manual" ? "selected" : ""}`}
            onClick={() => setUploadMode("manual")}
          >
            Manual R2 Key
          </button>
        </div>
      </div>

      {uploadMode === "file" ? (
        <div className="field">
          <label>Select PDF</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
          />
          {selectedFile && (
            <p className="hint">{selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)</p>
          )}
        </div>
      ) : (
        <div className="field">
          <label>R2 Object Key</label>
          <input
            type="text"
            placeholder="e.g. manufacturers/abc123/guide.pdf"
            value={r2KeyManual}
            onChange={(e) => setR2KeyManual(e.target.value)}
          />
          <p className="hint">
            Paste the R2 object key if you uploaded the file manually.
          </p>
        </div>
      )}

      <div className="form-actions">
        <button
          className="btn secondary"
          onClick={() => handleSaveDraft(false)}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save as Draft"}
        </button>
        <button
          className="btn primary"
          onClick={() => handleSaveDraft(true)}
          disabled={saving}
        >
          {saving ? "Submitting…" : "Save & Submit for Review"}
        </button>
      </div>

      <div className="advisory-banner">
        All content is advisory only — not a substitute for professional advice.
      </div>
    </div>
  );
}
