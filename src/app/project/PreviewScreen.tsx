import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StickyFooter } from "../../components/ui/StickyFooter";

export function PreviewScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div className="screen preview">
      <header>
        <Button variant="secondary" onClick={() => navigate(`/app/project/${projectId}/review`)}>
          ← Review
        </Button>
        <h2>Quote Request Preview</h2>
      </header>

      <Card className="rfq-preview">
        <div className="preview-placeholder">
          <p>RFQ preview will render here.</p>
        </div>
        <div className="actions">
          <Button variant="secondary">Download PDF</Button>
          <Button variant="secondary">Download CSV</Button>
        </div>
      </Card>

      <Card as="aside" className="summary-panel" compact>
        <h3>Summary</h3>
        <p className="hint">Supplier, stage, fulfilment and required-by details appear here.</p>
      </Card>

      <StickyFooter>
        <Button
          variant="secondary"
          onClick={() => navigate(`/app/project/${projectId}/review`)}
        >
          Back to edit
        </Button>
        <Button variant="secondary" onClick={() => navigate("/app")}>Save draft</Button>
        <Button
          onClick={() => {
            navigate("/app");
          }}
        >
          Send quote request
        </Button>
      </StickyFooter>
    </div>
  );
}
