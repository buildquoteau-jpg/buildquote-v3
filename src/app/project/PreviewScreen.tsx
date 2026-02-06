// S7 — RFQ Preview & Send
// READ-ONLY: PDF, CSV, HTML email preview
// WRITES: supplierRFQ record on send
// This is the final checkpoint — preview must match sent email 1:1

export function PreviewScreen() {
  return (
    <div className="screen preview">
      <h2>Quote Request Preview</h2>

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
        <button className="btn secondary">Back to edit</button>
        <button className="btn secondary">Save draft</button>
        <button className="btn primary">Send quote request</button>
      </div>
    </div>
  );
}
