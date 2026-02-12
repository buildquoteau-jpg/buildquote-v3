// S9 — RFQ Preview
import { useNavigate, useParams } from "react-router-dom";
import { DisclaimerBlock } from "../../components/DisclaimerBlock";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StickyFooter } from "../../components/ui/StickyFooter";

export function RfqPreviewScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const handleSend = () => {
    navigate(`/projects/${projectId}/tracking`);
  };

  return (
    <div className="screen rfq-preview-screen">
      <header>
        <Button variant="secondary" onClick={() => navigate(`/projects/${projectId}/suppliers`)}>
          ← Suppliers
        </Button>
        <h2>RFQ Preview</h2>
      </header>

      <Card className="rfq-preview">
        <h3>Project Details</h3>
        <p className="hint">Project name, address, and stage will appear here from saved data.</p>
      </Card>

      <Card>
        <h3>Scope</h3>
        <p className="hint">Builder-entered scope of works will appear here.</p>
      </Card>

      <Card>
        <h3>Structured Materials List</h3>
        <div className="rfq-materials-placeholder">
          <p className="hint">
            Component groups and line items with specifications and quantities will render here.
          </p>
        </div>
      </Card>

      <Card>
        <h3>Suppliers</h3>
        <p className="hint">Selected supplier names and contact details will appear here.</p>
      </Card>

      <Card compact>
        <DisclaimerBlock />
      </Card>

      <StickyFooter>
        <Button variant="secondary" onClick={() => navigate("/dashboard")}>
          Save Draft
        </Button>
        <Button onClick={handleSend}>
          Send RFQ
        </Button>
      </StickyFooter>
    </div>
  );
}
