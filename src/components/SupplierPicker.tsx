import type { Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/Button";

interface SupplierOption {
  _id: Id<"suppliers">;
  name: string;
  email: string;
}

interface SupplierPickerProps {
  suppliers: SupplierOption[];
  selectedId: Id<"suppliers"> | null;
  onSelect: (id: Id<"suppliers">) => void;
  onAddNew: () => void;
}

export function SupplierPicker({ suppliers, selectedId, onSelect, onAddNew }: SupplierPickerProps) {
  return (
    <div className="supplier-picker">
      <label>Select supplier</label>
      <p className="hint">Each quote request is sent to one supplier at a time.</p>
      <select
        className="bq-select"
        value={selectedId ?? ""}
        onChange={(e) => onSelect(e.target.value as Id<"suppliers">)}
      >
        <option value="" disabled>
          Choose a supplier...
        </option>
        {suppliers.map((s) => (
          <option key={s._id} value={s._id}>
            {s.name} — {s.email}
          </option>
        ))}
      </select>
      <Button className="add-supplier-btn" variant="secondary" onClick={onAddNew}>
        + Add new supplier
      </Button>
    </div>
  );
}
