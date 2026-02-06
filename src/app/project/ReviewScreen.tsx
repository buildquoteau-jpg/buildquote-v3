// S6 — Review & Supplier Details
// READS: quoteRequests, suppliers, lineItems
// WRITES: fulfilment, delivery details, supplier message
// AI RULES: no AI decisions
// BOUNDARIES: no sending from S6, no bulk send, no materials editing

import { useState } from "react";
import { SupplierPicker } from "../../components/SupplierPicker";
import type { Id } from "../../../convex/_generated/dataModel";
import type { FulfilmentType } from "../../types/quote";

export function ReviewScreen() {
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
      <h2>Review & Supplier Details</h2>

      {/* Section A — Fulfilment Method */}
      <section>
        <h3>Fulfilment</h3>
        <div className="toggle-group">
          <button
            className={fulfilmentType === "delivery" ? "active" : ""}
            onClick={() => setFulfilmentType("delivery")}
          >
            Delivery
          </button>
          <button
            className={fulfilmentType === "pickup" ? "active" : ""}
            onClick={() => setFulfilmentType("pickup")}
          >
            Pickup
          </button>
        </div>
        {fulfilmentType === "delivery" ? (
          <>
            <input
              type="text"
              placeholder="Site address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />
            <input
              type="text"
              placeholder="Delivery window (optional)"
              value={deliveryWindow}
              onChange={(e) => setDeliveryWindow(e.target.value)}
            />
          </>
        ) : (
          <input
            type="text"
            placeholder="Pickup suburb/location (optional)"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
          />
        )}
        <p className="hint">Details are provided for supplier context only.</p>
      </section>

      {/* Section B — Project Timing */}
      <section>
        <h3>Project Timing (optional)</h3>
        <input
          type="date"
          value={projectStartDate}
          onChange={(e) => setProjectStartDate(e.target.value)}
        />
        <input
          type="date"
          value={requiredByDate}
          onChange={(e) => setRequiredByDate(e.target.value)}
        />
      </section>

      {/* Section C — Message to Supplier */}
      <section>
        <h3>Message to supplier (optional)</h3>
        <textarea
          rows={3}
          placeholder="Please advise lead times and availability."
          value={supplierMessage}
          onChange={(e) => setSupplierMessage(e.target.value)}
        />
      </section>

      {/* Section D — Supplier Selection */}
      <section>
        <SupplierPicker
          suppliers={[]}
          selectedId={selectedSupplierId}
          onSelect={setSelectedSupplierId}
          onAddNew={() => {
            /* TODO: open add supplier modal */
          }}
        />
      </section>

      {/* Section E — Actions */}
      <div className="actions">
        <button className="btn secondary">Save draft</button>
        <button className="btn primary">Continue to preview</button>
      </div>
    </div>
  );
}
