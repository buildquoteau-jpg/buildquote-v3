import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SupplierPicker } from "../../components/SupplierPicker";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StickyFooter } from "../../components/ui/StickyFooter";
import { TextField } from "../../components/ui/TextField";
import { Toggle } from "../../components/ui/Toggle";
import type { Id } from "../../../convex/_generated/dataModel";
import type { FulfilmentType } from "../../types/quote";

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
        <Button variant="secondary" onClick={() => navigate(`/app/project/${projectId}/build-up`)}>
          ← Build-Up
        </Button>
        <h2>Review & Supplier Details</h2>
      </header>

      <Card>
        <h3>Fulfilment</h3>
        <div className="toggle-group">
          <Toggle
            value={fulfilmentType}
            onChange={setFulfilmentType}
            options={[
              { value: "delivery", label: "Delivery" },
              { value: "pickup", label: "Pickup" },
            ]}
          />
        </div>
        {fulfilmentType === "delivery" ? (
          <>
            <TextField
              label="Site address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />
            <TextField
              label="Delivery window (optional)"
              value={deliveryWindow}
              onChange={(e) => setDeliveryWindow(e.target.value)}
            />
          </>
        ) : (
          <TextField
            label="Pickup suburb/location (optional)"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
          />
        )}
        <p className="hint">Details are provided for supplier context only.</p>
      </Card>

      <Card>
        <h3>Project Timing (optional)</h3>
        <TextField
          label="Estimated project start"
          type="date"
          value={projectStartDate}
          onChange={(e) => setProjectStartDate(e.target.value)}
        />
        <TextField
          label="Required by"
          type="date"
          value={requiredByDate}
          onChange={(e) => setRequiredByDate(e.target.value)}
        />
      </Card>

      <Card>
        <h3>Message to supplier (optional)</h3>
        <textarea
          className="bq-textarea"
          rows={3}
          placeholder="Please advise lead times and availability."
          value={supplierMessage}
          onChange={(e) => setSupplierMessage(e.target.value)}
        />
      </Card>

      <Card>
        <SupplierPicker
          suppliers={[]}
          selectedId={selectedSupplierId}
          onSelect={setSelectedSupplierId}
          onAddNew={() => {
            // TODO
          }}
        />
      </Card>

      <StickyFooter>
        <Button variant="secondary" onClick={() => navigate("/app")}>Save draft</Button>
        <Button onClick={() => navigate(`/app/project/${projectId}/preview`)}>Continue to preview</Button>
      </StickyFooter>
    </div>
  );
}
