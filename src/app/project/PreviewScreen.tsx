// S7 — RFQ Preview & Send
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, StickyFooter } from "../../components/ui";
import { printRfqAsPdf } from "../../lib/rfqPdf";

export function PreviewScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const previewData = {
    builder: {
      companyName: "Southwest Constructions",
      email: "quotes@southwest.example",
      phone: "0400 000 000",
      logoUrl: "",
    },
    project: {
      name: "Smith Residence",
      address: "12 Yallingup Rd, Dunsborough WA",
      stage: "Decking / Pergola / Outdoor Structures",
      scopes: ["Supply of H4 structural posts, post stirrups, concrete and fixings for pergola structure."],
      createdAt: new Date().toLocaleDateString(),
    },
    items: [
      { group: "Structural posts", description: "H4 treated post", spec: "100x100 x 3.0m", unit: "each", quantity: 8 },
      { group: "Fixings", description: "Galvanised anchor bolts", spec: "M12 x 150", unit: "box", quantity: 1 },
    ],
    disclaimer:
      "BuildQuote assists with structuring material quote requests only. It does not make engineering, compliance, quantity, or suitability decisions.",
  };

  return (
    <div className="screen preview">
      <header>
        <Button variant="ghost" onClick={() => navigate(`/project/${projectId}/review`)}>← Review</Button>
        <h2>Quote Request Preview</h2>
      </header>

      <Card>
        <p><strong>{previewData.project.name}</strong></p>
        <p className="bq-hint">{previewData.project.address}</p>
        <p className="bq-hint">{previewData.project.stage}</p>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" onClick={() => printRfqAsPdf(previewData)}>Download PDF</Button>
          <Button variant="secondary">Download CSV</Button>
        </div>
      </Card>

      <StickyFooter>
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
          <Button variant="secondary" onClick={() => navigate(`/project/${projectId}/review`)}>Back to edit</Button>
          <Button variant="secondary" onClick={() => navigate("/")}>Save draft</Button>
          <Button variant="primary" onClick={() => navigate("/")}>Send quote request</Button>
        </div>
      </StickyFooter>
    </div>
  );
}
