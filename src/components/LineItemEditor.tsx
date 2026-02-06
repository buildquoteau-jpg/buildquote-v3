import { useState } from "react";
import type { PurchaseUnit } from "../types/lineItem";

interface LineItemEditorProps {
  onSave: (item: {
    description: string;
    spec?: string;
    dimensions?: string;
    unit: PurchaseUnit;
    packSize?: string;
    quantity: number;
  }) => void;
  initial?: {
    description: string;
    spec?: string;
    dimensions?: string;
    unit: PurchaseUnit;
    packSize?: string;
    quantity: number;
  };
}

const UNITS: PurchaseUnit[] = ["each", "pack", "box", "bag"];

export function LineItemEditor({ onSave, initial }: LineItemEditorProps) {
  const [description, setDescription] = useState(initial?.description ?? "");
  const [spec, setSpec] = useState(initial?.spec ?? "");
  const [dimensions, setDimensions] = useState(initial?.dimensions ?? "");
  const [unit, setUnit] = useState<PurchaseUnit>(initial?.unit ?? "each");
  const [packSize, setPackSize] = useState(initial?.packSize ?? "");
  const [quantity, setQuantity] = useState(initial?.quantity ?? 1);

  const handleSave = () => {
    if (!description.trim()) return;
    onSave({
      description: description.trim(),
      spec: spec.trim() || undefined,
      dimensions: dimensions.trim() || undefined,
      unit,
      packSize: packSize.trim() || undefined,
      quantity,
    });
  };

  return (
    <div className="line-item-editor">
      <input
        type="text"
        placeholder="Item description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Specification / variant"
        value={spec}
        onChange={(e) => setSpec(e.target.value)}
      />
      <input
        type="text"
        placeholder="Dimensions (e.g. 12mm × 150mm)"
        value={dimensions}
        onChange={(e) => setDimensions(e.target.value)}
      />
      <select value={unit} onChange={(e) => setUnit(e.target.value as PurchaseUnit)}>
        {UNITS.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>
      {unit !== "each" && (
        <input
          type="text"
          placeholder="Pack size (e.g. Box of 25)"
          value={packSize}
          onChange={(e) => setPackSize(e.target.value)}
        />
      )}
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      <button onClick={handleSave}>Save item</button>
    </div>
  );
}
