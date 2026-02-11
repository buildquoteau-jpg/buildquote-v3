// S6 — Review & Supplier Details
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SupplierPicker } from "../../components/SupplierPicker";
import type { Id } from "../../../convex/_generated/dataModel";
import type { FulfilmentType } from "../../types/quote";
import { Button, Card, Input, StickyFooter, Textarea, Toggle } from "../../components/ui";

export function ReviewScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [fulfilmentType, setFulfilmentType] = useState<FulfilmentType>("delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryWindow, setDeliveryWindow] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [requiredByDate, setRequiredByDate] = useState("");
  const [supplierMessage, setSupplierMessage] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<Id<"suppliers"> | null>(null);

  return (
    <div className="screen review">
      <header>
        <Button variant="ghost" onClick={() => navigate(`/project/${projectId}/build-up`)}>← Build-Up</Button>
        <h2>Review & Supplier Details</h2>
      </header>

      <Card>
        <h3>Fulfilment</h3>
        <Toggle
          options={[{ label: "Delivery", value: "delivery" }, { label: "Pickup", value: "pickup" }]}
          value={fulfilmentType}
          onChange={(value) => setFulfilmentType(value)}
        />
        <div className="field" style={{ marginTop: 12 }}>
          {fulfilmentType === "delivery" ? (
            <>
              <Input placeholder="Site address" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} />
              <Input placeholder="Delivery window (optional)" value={deliveryWindow} onChange={(e) => setDeliveryWindow(e.target.value)} style={{ marginTop: 8 }} />
            </>
          ) : (
            <Input placeholder="Pickup suburb/location (optional)" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} />
          )}
          <p className="bq-hint">Details are provided for supplier context only.</p>
        </div>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <h3>Project timing (optional)</h3>
        <Input type="date" value={projectStartDate} onChange={(e) => setProjectStartDate(e.target.value)} />
        <Input type="date" value={requiredByDate} onChange={(e) => setRequiredByDate(e.target.value)} style={{ marginTop: 8 }} />
      </Card>

      <Card style={{ marginTop: 12 }}>
        <h3>Message to supplier (optional)</h3>
        <Textarea rows={3} placeholder="Please advise lead times and availability." value={supplierMessage} onChange={(e) => setSupplierMessage(e.target.value)} />
      </Card>

      <Card style={{ marginTop: 12 }}>
        <SupplierPicker suppliers={[]} selectedId={selectedSupplierId} onSelect={setSelectedSupplierId} onAddNew={() => undefined} />
      </Card>

      <StickyFooter>
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
          <Button variant="secondary" onClick={() => navigate("/")}>Save draft</Button>
          <Button variant="primary" onClick={() => navigate(`/project/${projectId}/preview`)}>Continue to preview</Button>
        </div>
      </StickyFooter>
    </div>
  );
}
