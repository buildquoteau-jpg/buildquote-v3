// S10 — Supplier Tracking
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StickyFooter } from "../../components/ui/StickyFooter";

type SupplierStatus = "sent" | "will_quote" | "declined";

interface SupplierRfq {
  name: string;
  sentDate: string;
  status: SupplierStatus;
  respondedAt?: string;
}

const STATUS_CONFIG: Record<SupplierStatus, { label: string; badgeClass: string }> = {
  sent: { label: "Sent", badgeClass: "bq-badge--neutral" },
  will_quote: { label: "Will Quote", badgeClass: "bq-badge--success" },
  declined: { label: "Declined", badgeClass: "bq-badge--warning" },
};

export function SupplierTrackingScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  // TODO: load sent RFQs from Convex once the send mutation persists them
  const suppliers: SupplierRfq[] = [];

  return (
    <div className="screen supplier-tracking">
      <header>
        <Button
          variant="secondary"
          onClick={() => navigate(`/projects/${projectId}`)}
        >
          ← Back to Project
        </Button>
        <h2>Supplier Tracking</h2>
      </header>

      {suppliers.length > 0 ? (
        suppliers.map((supplier) => {
          const { label, badgeClass } = STATUS_CONFIG[supplier.status];
          return (
            <Card key={supplier.name}>
              <div className="supplier-tracking-row">
                <div className="supplier-tracking-info">
                  <strong>{supplier.name}</strong>
                  <span className="hint">Sent {supplier.sentDate}</span>
                  {supplier.respondedAt && (
                    <span className="hint">Responded {supplier.respondedAt}</span>
                  )}
                </div>
                <span className={`bq-badge ${badgeClass}`}>{label}</span>
              </div>
            </Card>
          );
        })
      ) : (
        <Card>
          <p className="hint">
            No quote requests sent yet. Once you send a request from the
            preview screen, tracking details will appear here.
          </p>
        </Card>
      )}

      <StickyFooter>
        <Button to="/dashboard">Back to Dashboard</Button>
      </StickyFooter>
    </div>
  );
}
