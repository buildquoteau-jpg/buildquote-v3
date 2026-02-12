// S13 — Document Library
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { TextField } from "../../components/ui/TextField";

type DocType = "installation" | "tech_data" | "span_table";

interface DocumentRecord {
  id: string;
  title: string;
  type: DocType;
  category: string;
}

const TYPE_LABELS: Record<DocType, string> = {
  installation: "Installation Guide",
  tech_data: "Tech Data",
  span_table: "Span Table",
};

const DEMO_DOCUMENTS: DocumentRecord[] = [
  { id: "d1", title: "Treated Pine Post Installation Guide", type: "installation", category: "Structural" },
  { id: "d2", title: "Post Stirrup Technical Data Sheet", type: "tech_data", category: "Structural" },
  { id: "d3", title: "Timber Beam Span Tables", type: "span_table", category: "Structural" },
  { id: "d4", title: "Colorbond Roofing Installation Guide", type: "installation", category: "Roofing" },
  { id: "d5", title: "Fibre Cement Cladding Technical Data", type: "tech_data", category: "Cladding" },
  { id: "d6", title: "Steel Bearer Span Tables", type: "span_table", category: "Structural" },
  { id: "d7", title: "Concrete Slab Reinforcement Guide", type: "installation", category: "Slab" },
  { id: "d8", title: "Insulation R-Value Reference", type: "tech_data", category: "Insulation" },
];

export function DocumentLibraryScreen() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [filterType, setFilterType] = useState<DocType | "all">("all");

  const filtered = useMemo(() => {
    let results = DEMO_DOCUMENTS;

    if (filterType !== "all") {
      results = results.filter((d) => d.type === filterType);
    }

    const term = searchValue.trim().toLowerCase();
    if (term) {
      results = results.filter(
        (d) =>
          d.title.toLowerCase().includes(term) ||
          d.category.toLowerCase().includes(term)
      );
    }

    return results;
  }, [searchValue, filterType]);

  return (
    <div className="screen document-library-screen">
      <header>
        <Button variant="secondary" onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </Button>
        <h2>Document Library</h2>
      </header>

      <Card>
        <TextField
          label="Search documents"
          placeholder="Search by title or category"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className="stage-pills" style={{ marginTop: "var(--bq-space-2)" }}>
          {(["all", "installation", "tech_data", "span_table"] as const).map((type) => (
            <button
              key={type}
              type="button"
              className={`stage-pill${filterType === type ? " selected" : ""}`}
              onClick={() => setFilterType(type)}
            >
              {type === "all" ? "All" : TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </Card>

      <div className="supplier-card-list">
        {filtered.length === 0 ? (
          <Card compact>
            <p className="hint">No documents match your search.</p>
          </Card>
        ) : (
          filtered.map((doc) => (
            <Card key={doc.id} compact className="supplier-card">
              <div className="supplier-card-head">
                <strong>{doc.title}</strong>
                <span className="bq-badge bq-badge--neutral">{TYPE_LABELS[doc.type]}</span>
              </div>
              <p className="hint">{doc.category}</p>
              <Button variant="secondary" onClick={() => { /* TODO: download */ }}>
                Download
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
