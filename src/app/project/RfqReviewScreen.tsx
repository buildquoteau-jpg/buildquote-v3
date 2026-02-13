// S8 — Request for Quotation – Review (editable operational review)
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useBuilderAccount } from "../hooks/useBuilderAccount";
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

function useSpeechRecognition(
  onResult: (text: string) => void,
  onInterim: (text: string) => void,
) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const supported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const start = useCallback(() => {
    if (!supported) return;
    const Cls = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Cls) return;
    const r = new Cls();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-AU";
    r.onresult = (event: SpeechRecognitionEvent) => {
      let fin = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res?.isFinal) fin += res[0]?.transcript ?? "";
        else interim += res?.[0]?.transcript ?? "";
      }
      if (fin) onResult(fin);
      if (interim) onInterim(interim);
    };
    r.onend = () => setIsListening(false);
    r.onerror = () => setIsListening(false);
    recognitionRef.current = r;
    r.start();
    setIsListening(true);
  }, [supported, onResult, onInterim]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  useEffect(() => () => { recognitionRef.current?.abort(); }, []);
  return { isListening, start, stop, supported };
}

export function RfqReviewScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const stage = searchParams.get("stage") ?? "";

  const { builderId } = useBuilderAccount();

  // Delivery + timing
  const [deliveryWindow, setDeliveryWindow] = useState("ASAP");
  const [requiredDate, setRequiredDate] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("");

  // Supplier message
  const [supplierMessage, setSupplierMessage] = useState("");
  const [interimText, setInterimText] = useState("");

  const handleVoiceResult = useCallback((text: string) => {
    setSupplierMessage((prev) => (prev ? `${prev} ${text}` : text));
    setInterimText("");
  }, []);
  const handleInterim = useCallback((text: string) => setInterimText(text), []);
  const { isListening, start, stop, supported } = useSpeechRecognition(handleVoiceResult, handleInterim);

  // Supplier selection
  const suppliersFromDb = useQuery(
    api.suppliers.listSuppliers,
    builderId ? { builderId } : "skip",
  );
  const [localSuppliers, setLocalSuppliers] = useState<SupplierEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchValue, setSearchValue] = useState("");
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");

  // Merge DB suppliers into local list once
  const mergedRef = useRef(false);
  useEffect(() => {
    if (suppliersFromDb && !mergedRef.current) {
      mergedRef.current = true;
      setLocalSuppliers(
        suppliersFromDb.map((s) => ({
          id: s._id,
          name: s.name,
          email: s.email,
          phone: s.phone ?? "",
        })),
      );
    }
  }, [suppliersFromDb]);

  const allSuppliers = localSuppliers;
  const filteredSuppliers = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    if (!term) return allSuppliers;
    return allSuppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term),
    );
  }, [searchValue, allSuppliers]);

  const toggleSupplier = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddSupplier = () => {
    if (!newName.trim() || !newEmail.trim()) return;
    const id = `new-${Date.now()}`;
    setLocalSuppliers((prev) => [
      ...prev,
      { id, name: newName.trim(), email: newEmail.trim(), phone: newPhone.trim() },
    ]);
    setSelectedIds((prev) => new Set(prev).add(id));
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setAddingNew(false);
  };

  const messageDisplay = supplierMessage + (interimText ? ` ${interimText}` : "");

  return (
    <div className="screen rfq-review-screen">
      <header>
        <Button
          variant="secondary"
          onClick={() =>
            navigate(`/projects/${projectId}/items?stage=${encodeURIComponent(stage)}`)
          }
        >
          ← Back to Line Items
        </Button>
        <h2>Request for Quotation – Review</h2>
      </header>

      {/* A: Project summary */}
      <Card>
        <h3>Project Summary</h3>
        <p className="hint">
          Stage: <strong>{stage || "Not selected"}</strong>
        </p>
        <p className="hint">
          Review your scope and materials before sending to suppliers.
        </p>
      </Card>

      {/* D: Delivery + timing */}
      <Card>
        <h3>Delivery &amp; Timing</h3>
        <div className="field">
          <label className="bq-text-field">
            <span>Delivery window</span>
            <select
              className="bq-select"
              value={deliveryWindow}
              onChange={(e) => setDeliveryWindow(e.target.value)}
            >
              <option value="ASAP">ASAP</option>
              <option value="1 week">1 week</option>
              <option value="2 weeks">2 weeks</option>
              <option value="3 weeks">3 weeks</option>
              <option value="4 weeks">4 weeks</option>
              <option value="custom">Custom date range</option>
            </select>
          </label>
        </div>
        <div className="field">
          <TextField
            label="Required delivery date"
            type="date"
            value={requiredDate}
            onChange={(e) => setRequiredDate(e.target.value)}
          />
        </div>
        <div className="field">
          <TextField
            label="Project start date"
            type="date"
            value={projectStartDate}
            onChange={(e) => setProjectStartDate(e.target.value)}
          />
        </div>
      </Card>

      {/* E: Message to supplier */}
      <Card>
        <h3>Message to Supplier</h3>
        <div className="scope-textarea-wrapper">
          <textarea
            className="bq-textarea"
            rows={3}
            value={messageDisplay}
            onChange={(e) => {
              setSupplierMessage(e.target.value);
              setInterimText("");
            }}
            placeholder="Add any additional notes for the supplier..."
          />
          {supported ? (
            <button
              type="button"
              className={`bq-icon-btn scope-mic-btn ${isListening ? "scope-mic-btn--active" : ""}`}
              onClick={isListening ? stop : start}
              title={isListening ? "Stop recording" : "Voice input"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
          ) : null}
        </div>
        {isListening && (
          <p className="hint" style={{ color: "var(--bq-accent)" }}>
            Listening...
          </p>
        )}
      </Card>

      {/* G: Supplier selection */}
      <Card>
        <h3>Select Suppliers</h3>
        <div className="field">
          <TextField
            label="Search suppliers"
            placeholder="Filter by name or email"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        {filteredSuppliers.length > 0 ? (
          <div className="component-group-list">
            {filteredSuppliers.map((supplier) => (
              <label key={supplier.id} className="group-row">
                <input
                  type="checkbox"
                  checked={selectedIds.has(supplier.id)}
                  onChange={() => toggleSupplier(supplier.id)}
                />
                <div>
                  <span>{supplier.name}</span>
                  <span className="hint" style={{ marginLeft: 8 }}>
                    {supplier.email}
                  </span>
                </div>
              </label>
            ))}
          </div>
        ) : (
          <p className="hint">
            No suppliers found.{" "}
            {allSuppliers.length === 0
              ? "Add your first supplier below."
              : "Try a different search."}
          </p>
        )}

        {addingNew ? (
          <div className="add-group-inline" style={{ marginTop: 12 }}>
            <div className="field">
              <TextField
                label="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Supplier name"
              />
            </div>
            <div className="field">
              <TextField
                label="Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="supplier@example.com"
              />
            </div>
            <div className="field">
              <TextField
                label="Phone (optional)"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="08 9700 1000"
              />
            </div>
            <div className="actions">
              <Button variant="secondary" onClick={() => setAddingNew(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddSupplier}
                disabled={!newName.trim() || !newEmail.trim()}
              >
                Add Supplier
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="secondary"
            className="add-group-btn"
            onClick={() => setAddingNew(true)}
            style={{ marginTop: 8 }}
          >
            + Add New Supplier
          </Button>
        )}
      </Card>

      <StickyFooter>
        <Button
          variant="secondary"
          onClick={() => navigate(`/projects/${projectId}`)}
        >
          Save Draft
        </Button>
        <Button
          disabled={selectedIds.size === 0}
          onClick={() =>
            navigate(`/projects/${projectId}/preview?stage=${encodeURIComponent(stage)}`)
          }
        >
          Continue to Preview
        </Button>
      </StickyFooter>
    </div>
  );
}
