// S7 — Line Item Selection
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { DisclaimerBlock } from "../../components/DisclaimerBlock";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StickyFooter } from "../../components/ui/StickyFooter";

interface LineItem {
  id: string;
  groupName: string;
  description: string;
  spec: string;
  quantity: number;
  unit: string;
}

const DEMO_ITEMS: LineItem[] = [
  { id: "1", groupName: "Structural Posts", description: "H4 Treated Pine Post", spec: "90x90mm", quantity: 6, unit: "each" },
  { id: "2", groupName: "Structural Posts", description: "H4 Treated Pine Post", spec: "140x140mm", quantity: 2, unit: "each" },
  { id: "3", groupName: "Stirrup Anchors", description: "Post Stirrup", spec: "90mm", quantity: 6, unit: "each" },
  { id: "4", groupName: "Stirrup Anchors", description: "Post Stirrup", spec: "140mm", quantity: 2, unit: "each" },
  { id: "5", groupName: "Concrete", description: "Premix Concrete", spec: "20MPa", quantity: 8, unit: "bag" },
  { id: "6", groupName: "Fixings", description: "Coach Bolt", spec: "M12x150mm", quantity: 24, unit: "each" },
  { id: "7", groupName: "Accessories", description: "Post Cap", spec: "90mm", quantity: 6, unit: "each" },
];

function groupItems(items: LineItem[]): Map<string, LineItem[]> {
  const grouped = new Map<string, LineItem[]>();
  for (const item of items) {
    const existing = grouped.get(item.groupName) ?? [];
    existing.push(item);
    grouped.set(item.groupName, existing);
  }
  return grouped;
}

export function LineItemsScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const stage = searchParams.get("stage") ?? "";

  const [items, setItems] = useState<LineItem[]>(DEMO_ITEMS);

  const handleQuantityChange = (id: string, value: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(0, value) } : item))
    );
  };

  const grouped = groupItems(items);

  return (
    <div className="screen line-items">
      <header>
        <Button variant="secondary" onClick={() => navigate(`/projects/${projectId}/components?stage=${encodeURIComponent(stage)}`)}>
          ← Groups
        </Button>
        <h2>Line Item Selection</h2>
      </header>

      <p className="hint">
        Define specifications and quantities for each material group. You can
        scroll back and revise at any time.
      </p>

      {Array.from(grouped.entries()).map(([groupName, groupItems]) => (
        <Card key={groupName}>
          <h3>{groupName}</h3>
          <div className="line-items-list">
            {groupItems.map((item) => (
              <div key={item.id} className="line-item-row">
                <div className="line-item-info">
                  <strong>{item.description}</strong>
                  <span className="hint">{item.spec}</span>
                </div>
                <div className="line-item-controls">
                  <input
                    type="number"
                    className="bq-input line-item-qty"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                    min={0}
                  />
                  <span className="line-item-unit">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <Card compact>
        <DisclaimerBlock />
      </Card>

      <StickyFooter>
        <Button onClick={() => navigate(`/projects/${projectId}/suppliers`)}>
          Continue
        </Button>
      </StickyFooter>
    </div>
  );
}
