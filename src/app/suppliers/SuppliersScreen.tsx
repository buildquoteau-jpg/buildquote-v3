// S11 — Supplier Library
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { TextField } from "../../components/ui/TextField";

interface SupplierRecord {
  id: string;
  name: string;
  category: string;
  region: string;
  contact: string;
  email: string;
  phone: string;
}

const INITIAL_SUPPLIERS: SupplierRecord[] = [
  { id: "1", name: "Southwest Timber Co.", category: "Timber", region: "Southwest WA", contact: "Brady Collins", email: "sales@swtimber.example", phone: "08 9700 1001" },
  { id: "2", name: "Southwest Concrete Supply", category: "Concrete", region: "Southwest WA", contact: "Elena Park", email: "orders@swconcrete.example", phone: "08 9700 1002" },
  { id: "3", name: "Southwest Roofing Direct", category: "Roofing", region: "Southwest WA", contact: "Luca Moore", email: "estimating@swroofing.example", phone: "08 9700 1003" },
  { id: "4", name: "Southwest Hardware House", category: "Hardware", region: "Southwest WA", contact: "Mia Nguyen", email: "trade@swhardware.example", phone: "08 9700 1004" },
  { id: "5", name: "Southwest Insulation Hub", category: "Insulation", region: "Southwest WA", contact: "Noah Brooks", email: "quotes@swinsulation.example", phone: "08 9700 1005" },
  { id: "6", name: "Southwest Windows & Doors", category: "Windows", region: "Southwest WA", contact: "Ruby Singh", email: "trade@swwindows.example", phone: "08 9700 1006" },
];

export function SuppliersScreen() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>(INITIAL_SUPPLIERS);
  const [addingNew, setAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formContact, setFormContact] = useState("");

  const filteredSuppliers = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    if (!term) return suppliers;
    return suppliers.filter((s) =>
      s.name.toLowerCase().includes(term) ||
      s.category.toLowerCase().includes(term) ||
      s.region.toLowerCase().includes(term) ||
      s.contact.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term)
    );
  }, [searchValue, suppliers]);

  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormContact("");
    setAddingNew(false);
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!formName.trim() || !formEmail.trim()) return;
    setSuppliers((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        contact: formContact.trim(),
        category: "General",
        region: "",
      },
    ]);
    resetForm();
  };

  const startEdit = (s: SupplierRecord) => {
    setEditingId(s.id);
    setFormName(s.name);
    setFormEmail(s.email);
    setFormPhone(s.phone);
    setFormContact(s.contact);
    setAddingNew(false);
  };

  const handleSaveEdit = () => {
    if (!editingId || !formName.trim() || !formEmail.trim()) return;
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === editingId
          ? { ...s, name: formName.trim(), email: formEmail.trim(), phone: formPhone.trim(), contact: formContact.trim() }
          : s
      )
    );
    resetForm();
  };

  const handleDelete = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div className="screen suppliers-screen">
      <header>
        <Button variant="secondary" onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </Button>
        <h2>Supplier Library</h2>
      </header>

      <Card>
        <TextField
          label="Search suppliers"
          placeholder="Filter by name, category, region, or contact"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </Card>

      <div className="supplier-card-list">
        {filteredSuppliers.map((supplier) =>
          editingId === supplier.id ? (
            <Card key={supplier.id}>
              <h3>Edit Supplier</h3>
              <div className="field">
                <TextField label="Name" value={formName} onChange={(e) => setFormName(e.target.value)} />
              </div>
              <div className="field">
                <TextField label="Email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
              </div>
              <div className="field">
                <TextField label="Phone" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
              </div>
              <div className="field">
                <TextField label="Contact" value={formContact} onChange={(e) => setFormContact(e.target.value)} />
              </div>
              <div className="actions">
                <Button variant="secondary" onClick={resetForm}>Cancel</Button>
                <Button onClick={handleSaveEdit} disabled={!formName.trim() || !formEmail.trim()}>Save</Button>
              </div>
            </Card>
          ) : (
            <Card key={supplier.id} compact className="supplier-card">
              <div className="supplier-card-head">
                <strong>{supplier.name}</strong>
                <span className="bq-badge bq-badge--neutral">{supplier.category}</span>
              </div>
              {supplier.region ? <p className="hint">{supplier.region}</p> : null}
              <p>Contact: {supplier.contact}</p>
              <p>Email: {supplier.email}</p>
              {supplier.phone ? <p>Phone: {supplier.phone}</p> : null}
              <div className="actions">
                <Button variant="secondary" onClick={() => startEdit(supplier)}>Edit</Button>
                <Button variant="secondary" onClick={() => handleDelete(supplier.id)}>Delete</Button>
              </div>
            </Card>
          )
        )}
      </div>

      {addingNew ? (
        <Card>
          <h3>Add Supplier</h3>
          <div className="field">
            <TextField label="Name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Supplier name" />
          </div>
          <div className="field">
            <TextField label="Email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="supplier@example.com" />
          </div>
          <div className="field">
            <TextField label="Phone" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="08 9700 1000" />
          </div>
          <div className="field">
            <TextField label="Contact person" value={formContact} onChange={(e) => setFormContact(e.target.value)} placeholder="Contact name" />
          </div>
          <div className="actions">
            <Button variant="secondary" onClick={resetForm}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!formName.trim() || !formEmail.trim()}>Add Supplier</Button>
          </div>
        </Card>
      ) : (
        <Button variant="secondary" onClick={() => { resetForm(); setAddingNew(true); }}>
          + Add Supplier
        </Button>
      )}
    </div>
  );
}
