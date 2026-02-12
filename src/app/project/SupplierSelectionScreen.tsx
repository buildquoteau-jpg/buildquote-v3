// S8 — Supplier Selection
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StickyFooter } from "../../components/ui/StickyFooter";
import { TextField } from "../../components/ui/TextField";

interface SupplierEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const DEMO_SUPPLIERS: SupplierEntry[] = [
  { id: "s1", name: "Southwest Timber Co.", email: "sales@swtimber.example", phone: "08 9700 1001" },
  { id: "s2", name: "Southwest Concrete Supply", email: "orders@swconcrete.example", phone: "08 9700 1002" },
  { id: "s3", name: "Southwest Hardware House", email: "trade@swhardware.example", phone: "08 9700 1003" },
  { id: "s4", name: "Southwest Roofing Direct", email: "estimating@swroofing.example", phone: "08 9700 1004" },
];

export function SupplierSelectionScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchValue, setSearchValue] = useState("");
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [suppliers, setSuppliers] = useState<SupplierEntry[]>(DEMO_SUPPLIERS);

  const filteredSuppliers = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    if (!term) return suppliers;
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term)
    );
  }, [searchValue, suppliers]);

  const toggleSupplier = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAddSupplier = () => {
    if (!newName.trim() || !newEmail.trim()) return;
    const id = `new-${Date.now()}`;
    setSuppliers((prev) => [
      ...prev,
      { id, name: newName.trim(), email: newEmail.trim(), phone: newPhone.trim() },
    ]);
    setSelectedIds((prev) => new Set(prev).add(id));
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setAddingNew(false);
  };

  return (
    <div className="screen supplier-selection">
      <header>
        <Button variant="secondary" onClick={() => navigate(`/projects/${projectId}/items`)}>
          ← Line Items
        </Button>
        <h2>Select Suppliers</h2>
      </header>

      <Card>
        <TextField
          label="Search suppliers"
          placeholder="Filter by name or email"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </Card>

      <div className="supplier-card-list">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} compact className="supplier-card">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedIds.has(supplier.id)}
                onChange={() => toggleSupplier(supplier.id)}
              />
              <div>
                <strong>{supplier.name}</strong>
                <p className="hint">{supplier.email}</p>
                {supplier.phone ? <p className="hint">{supplier.phone}</p> : null}
              </div>
            </label>
          </Card>
        ))}
      </div>

      {addingNew ? (
        <Card>
          <h3>Add New Supplier</h3>
          <div className="field">
            <TextField label="Name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Supplier name" />
          </div>
          <div className="field">
            <TextField label="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="supplier@example.com" />
          </div>
          <div className="field">
            <TextField label="Phone (optional)" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="08 9700 1000" />
          </div>
          <div className="actions">
            <Button variant="secondary" onClick={() => setAddingNew(false)}>Cancel</Button>
            <Button onClick={handleAddSupplier} disabled={!newName.trim() || !newEmail.trim()}>Add Supplier</Button>
          </div>
        </Card>
      ) : (
        <Button variant="secondary" className="add-supplier-btn" onClick={() => setAddingNew(true)}>
          + Add New Supplier
        </Button>
      )}

      <StickyFooter>
        <Button
          disabled={selectedIds.size === 0}
          onClick={() => navigate(`/projects/${projectId}/preview`)}
        >
          Continue ({selectedIds.size} selected)
        </Button>
      </StickyFooter>
    </div>
  );
}
