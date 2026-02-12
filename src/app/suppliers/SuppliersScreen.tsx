import { useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { TextField } from "../../components/ui/TextField";

interface SeedSupplier {
  name: string;
  category: string;
  region: string;
  contact: string;
  email: string;
  website: string;
}

const SEEDED_SUPPLIERS: SeedSupplier[] = [
  {
    name: "Southwest Timber Co.",
    category: "Timber",
    region: "Southwest WA",
    contact: "Brady Collins",
    email: "sales@swtimber.example",
    website: "https://swtimber.example",
  },
  {
    name: "Southwest Concrete Supply",
    category: "Concrete",
    region: "Southwest WA",
    contact: "Elena Park",
    email: "orders@swconcrete.example",
    website: "https://swconcrete.example",
  },
  {
    name: "Southwest Roofing Direct",
    category: "Roofing",
    region: "Southwest WA",
    contact: "Luca Moore",
    email: "estimating@swroofing.example",
    website: "https://swroofing.example",
  },
  {
    name: "Southwest Hardware House",
    category: "Hardware",
    region: "Southwest WA",
    contact: "Mia Nguyen",
    email: "trade@swhardware.example",
    website: "https://swhardware.example",
  },
  {
    name: "Southwest Insulation Hub",
    category: "Insulation",
    region: "Southwest WA",
    contact: "Noah Brooks",
    email: "quotes@swinsulation.example",
    website: "https://swinsulation.example",
  },
  {
    name: "Southwest Windows & Doors",
    category: "Windows",
    region: "Southwest WA",
    contact: "Ruby Singh",
    email: "trade@swwindows.example",
    website: "https://swwindows.example",
  },
];

export function SuppliersScreen() {
  const [searchValue, setSearchValue] = useState("");

  const filteredSuppliers = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    if (!term) return SEEDED_SUPPLIERS;

    return SEEDED_SUPPLIERS.filter((supplier) => {
      return (
        supplier.name.toLowerCase().includes(term) ||
        supplier.category.toLowerCase().includes(term) ||
        supplier.region.toLowerCase().includes(term) ||
        supplier.contact.toLowerCase().includes(term) ||
        supplier.email.toLowerCase().includes(term)
      );
    });
  }, [searchValue]);

  return (
    <div className="screen suppliers-screen">
      <header>
        <h2>Suppliers</h2>
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
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.email} compact className="supplier-card">
            <div className="supplier-card-head">
              <strong>{supplier.name}</strong>
              <span className="bq-badge bq-badge--neutral">{supplier.category}</span>
            </div>
            <p className="hint">{supplier.region}</p>
            <p>Contact: {supplier.contact}</p>
            <p>Email: {supplier.email}</p>
            <p>
              Website:{" "}
              <a href={supplier.website} target="_blank" rel="noreferrer">
                {supplier.website}
              </a>
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
