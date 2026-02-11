// S7 — RFQ Preview & Send
// READ-ONLY: PDF, CSV, HTML email preview
// WRITES: supplierRFQ record on send
// This is the final checkpoint — preview must match sent email 1:1

import { useNavigate, useParams } from "react-router-dom";

export function PreviewScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div className="screen preview">
      <header>
        <button className="btn secondary" onClick={() => navigate(`/project/${projectId}/review`)}>
          ← Review
        </button>
        <h2>Quote Request Preview</h2>
      </header>

      {/* Section A — RFQ Preview */}
      <section className="rfq-preview">
        {/* TODO: HTML preview of the complete RFQ
          Must include:
          - Project name & stage
          - Site suburb
          - Fulfilment method
          - Dates (if provided)
          - Materials list (grouped as defined in S5)
          - Supplier message
        */}
        <div className="preview-placeholder">
          <p>RFQ preview will render here.</p>
        </div>
        <div className="download-actions">
          <button className="btn secondary">Download PDF</button>
          <button className="btn secondary">Download CSV</button>
        </div>
      </section>

      {/* Section B — Summary Panel */}
      <aside className="summary-panel">
        {/* TODO: Supplier name, Stage, Delivery/Pickup, Required-by date */}
      </aside>

      {/* Section C — Final Actions */}
      <div className="actions">
        <button className="btn secondary" onClick={() => navigate(`/project/${projectId}/review`)}>
          Back to edit
        </button>
        <button className="btn secondary" onClick={() => navigate("/")}>
          Save draft
        </button>
        <button className="btn primary" onClick={() => {
          // TODO: call sendQuoteRequest mutation
          navigate("/");
        }}>
          Send quote request
        </button>
      </div>
    </div>
  );
}
