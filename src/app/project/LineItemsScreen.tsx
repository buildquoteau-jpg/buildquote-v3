// S7 — Line Item Selection
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StickyFooter } from "../../components/ui/StickyFooter";

interface LineItem {
  id: string;
  groupName: string;
  description: string;
  spec: string;
  specOptions?: string[];
  quantity: number;
  unit: string;
}

// Stage-aware line item templates — all quantities start at 0
const STAGE_LINE_ITEMS: Record<string, LineItem[]> = {
  Roofing: [
    { id: "r1", groupName: "Roofing Sheets", description: "Roofing Sheet", spec: "Corrugated", specOptions: ["Corrugated", "Standing Seam", "Concealed Fix", "Custom Profile"], quantity: 0, unit: "sheets" },
    { id: "r2", groupName: "Roofing Sheets", description: "Roofing Sheet — Material", spec: "Colorbond", specOptions: ["Colorbond", "Zincalume", "Galvanised"], quantity: 0, unit: "sheets" },
    { id: "r3", groupName: "Roofing Sheets", description: "Roofing Sheet — Gauge", spec: "0.42mm BMT", specOptions: ["0.42mm BMT", "0.48mm BMT"], quantity: 0, unit: "sheets" },
    { id: "r4", groupName: "Ridge Capping", description: "Ridge Capping", spec: "Profile match", specOptions: ["Profile match", "Universal"], quantity: 0, unit: "m" },
    { id: "r5", groupName: "Flashings", description: "Barge Flashing", spec: "Standard", specOptions: ["Standard", "Custom"], quantity: 0, unit: "m" },
    { id: "r6", groupName: "Flashings", description: "Valley Flashing", spec: "Standard", quantity: 0, unit: "m" },
    { id: "r7", groupName: "Flashings", description: "Apron Flashing", spec: "Standard", quantity: 0, unit: "m" },
    { id: "r8", groupName: "Gutters & Downpipes", description: "Gutter", spec: "Quad 115mm", specOptions: ["Quad 115mm", "Half-round 120mm", "OG 115mm", "Square-line 100mm"], quantity: 0, unit: "m" },
    { id: "r9", groupName: "Gutters & Downpipes", description: "Downpipe", spec: "Round 90mm", specOptions: ["Round 90mm", "Square 100mm", "Round 75mm"], quantity: 0, unit: "m" },
    { id: "r10", groupName: "Fixings & Screws", description: "Roofing Screw — Type 17", spec: "12g x 65mm", specOptions: ["12g x 50mm", "12g x 65mm", "14g x 75mm"], quantity: 0, unit: "box" },
    { id: "r11", groupName: "Accessories", description: "Roof Sarking", spec: "Standard", quantity: 0, unit: "roll" },
    { id: "r12", groupName: "Accessories", description: "Foam Infill Strip", spec: "Corrugated profile", quantity: 0, unit: "each" },
    { id: "r13", groupName: "Accessories", description: "Silicone Sealant", spec: "Roof grade", quantity: 0, unit: "each" },
  ],
  "Slab / Footings": [
    { id: "s1", groupName: "Reinforcement Mesh", description: "SL82 Mesh", spec: "6.0m x 2.4m", specOptions: ["6.0m x 2.4m", "4.8m x 2.4m"], quantity: 0, unit: "sheets" },
    { id: "s2", groupName: "Reinforcement Mesh", description: "SL72 Mesh", spec: "6.0m x 2.4m", quantity: 0, unit: "sheets" },
    { id: "s3", groupName: "Chairs & Spacers", description: "Bar Chair", spec: "50mm", specOptions: ["40mm", "50mm", "65mm", "75mm"], quantity: 0, unit: "each" },
    { id: "s4", groupName: "Edge Form Timbers", description: "Edge Form Board", spec: "150x25mm H3 Pine", specOptions: ["100x25mm H3 Pine", "150x25mm H3 Pine", "200x25mm H3 Pine"], quantity: 0, unit: "m" },
    { id: "s5", groupName: "Edge Form Timbers", description: "Form Peg", spec: "50x50x600mm", quantity: 0, unit: "each" },
    { id: "s6", groupName: "Concrete", description: "Ready Mix Concrete", spec: "N20/10", specOptions: ["N20/10", "N25/10", "N32/10"], quantity: 0, unit: "m³" },
    { id: "s7", groupName: "Vapour Barrier", description: "Polyethylene Sheet", spec: "200μm", specOptions: ["200μm", "300μm"], quantity: 0, unit: "roll" },
    { id: "s8", groupName: "Accessories", description: "Tie Wire", spec: "1.6mm", quantity: 0, unit: "roll" },
  ],
  "Wall Framing": [
    { id: "wf1", groupName: "Wall Frames", description: "Stud", spec: "90x35mm MGP10", specOptions: ["70x35mm MGP10", "90x35mm MGP10", "90x45mm MGP10"], quantity: 0, unit: "m" },
    { id: "wf2", groupName: "Top & Bottom Plates", description: "Top Plate", spec: "90x35mm MGP10", specOptions: ["70x35mm MGP10", "90x35mm MGP10", "90x45mm MGP10"], quantity: 0, unit: "m" },
    { id: "wf3", groupName: "Top & Bottom Plates", description: "Bottom Plate", spec: "90x35mm H2 Treated", quantity: 0, unit: "m" },
    { id: "wf4", groupName: "Noggings", description: "Nogging", spec: "90x35mm MGP10", quantity: 0, unit: "m" },
    { id: "wf5", groupName: "Bracing", description: "Steel Strap Bracing", spec: "30mm", quantity: 0, unit: "m" },
    { id: "wf6", groupName: "Fasteners", description: "Framing Nail — Gun", spec: "75x3.05mm", specOptions: ["65x2.87mm", "75x3.05mm", "90x3.15mm"], quantity: 0, unit: "box" },
    { id: "wf7", groupName: "Accessories", description: "Wall Wrap", spec: "Standard", quantity: 0, unit: "roll" },
  ],
  "Roof Framing": [
    { id: "rf1", groupName: "Trusses", description: "Roof Truss", spec: "Standard Fink", specOptions: ["Standard Fink", "Scissor", "Mono", "Custom"], quantity: 0, unit: "each" },
    { id: "rf2", groupName: "Ridge Board & Rafters", description: "Ridge Board", spec: "190x35mm MGP10", specOptions: ["140x35mm MGP10", "190x35mm MGP10", "240x45mm MGP10"], quantity: 0, unit: "m" },
    { id: "rf3", groupName: "Ridge Board & Rafters", description: "Rafter", spec: "140x35mm MGP10", quantity: 0, unit: "m" },
    { id: "rf4", groupName: "Battens", description: "Roof Batten", spec: "35x70mm MGP10", specOptions: ["35x70mm MGP10", "50x50mm MGP10"], quantity: 0, unit: "m" },
    { id: "rf5", groupName: "Hardware & Connectors", description: "Triple Grip", spec: "Standard", quantity: 0, unit: "each" },
    { id: "rf6", groupName: "Hardware & Connectors", description: "Framing Anchor", spec: "Standard", quantity: 0, unit: "each" },
    { id: "rf7", groupName: "Fasteners", description: "Batten Screw", spec: "14g x 75mm", quantity: 0, unit: "box" },
    { id: "rf8", groupName: "Accessories", description: "Ceiling Batten", spec: "Steel Furring Channel", quantity: 0, unit: "m" },
  ],
  "External Cladding": [
    { id: "ec1", groupName: "Cladding Sheets", description: "Fibre Cement Sheet", spec: "2400x1200x9mm", specOptions: ["2400x1200x6mm", "2400x1200x9mm", "2700x1200x9mm"], quantity: 0, unit: "sheets" },
    { id: "ec2", groupName: "Cladding Sheets", description: "Weatherboard", spec: "4200x180mm", specOptions: ["4200x180mm", "4200x200mm"], quantity: 0, unit: "m" },
    { id: "ec3", groupName: "Cavity Battens", description: "Cavity Batten", spec: "40x20mm Treated", quantity: 0, unit: "m" },
    { id: "ec4", groupName: "Flashings", description: "Window Head Flashing", spec: "Standard", quantity: 0, unit: "m" },
    { id: "ec5", groupName: "Sealants", description: "External Sealant", spec: "Cladding grade", quantity: 0, unit: "each" },
    { id: "ec6", groupName: "Fixings", description: "Cladding Screw", spec: "10g x 50mm", quantity: 0, unit: "box" },
    { id: "ec7", groupName: "Accessories", description: "Corner Mould", spec: "External", quantity: 0, unit: "m" },
  ],
  "Internal Linings": [
    { id: "il1", groupName: "Plasterboard", description: "Plasterboard Sheet", spec: "2400x1200x10mm", specOptions: ["2400x1200x10mm", "2700x1200x10mm", "3000x1200x10mm", "2400x1200x13mm"], quantity: 0, unit: "sheets" },
    { id: "il2", groupName: "Plasterboard", description: "Wet Area Board", spec: "2400x1200x10mm", quantity: 0, unit: "sheets" },
    { id: "il3", groupName: "Cornices", description: "Cornice", spec: "55mm Cove", specOptions: ["55mm Cove", "75mm Cove", "90mm Cove", "Square Set"], quantity: 0, unit: "m" },
    { id: "il4", groupName: "Jointing Compounds", description: "Base Coat Compound", spec: "15kg", quantity: 0, unit: "each" },
    { id: "il5", groupName: "Jointing Compounds", description: "Paper Tape", spec: "75m Roll", quantity: 0, unit: "roll" },
    { id: "il6", groupName: "Screws & Fasteners", description: "Plasterboard Screw", spec: "6g x 32mm", specOptions: ["6g x 25mm", "6g x 32mm", "6g x 41mm"], quantity: 0, unit: "box" },
    { id: "il7", groupName: "Finishing Accessories", description: "External Angle", spec: "Aluminium", quantity: 0, unit: "m" },
  ],
  Services: [
    { id: "sv1", groupName: "Conduit", description: "Electrical Conduit", spec: "20mm Heavy Duty", specOptions: ["16mm Medium Duty", "20mm Heavy Duty", "25mm Heavy Duty"], quantity: 0, unit: "m" },
    { id: "sv2", groupName: "Cable Trays", description: "Cable Tray", spec: "150mm Wide", specOptions: ["100mm Wide", "150mm Wide", "200mm Wide"], quantity: 0, unit: "m" },
    { id: "sv3", groupName: "Switchboard Components", description: "Switchboard Enclosure", spec: "18-pole", specOptions: ["12-pole", "18-pole", "24-pole", "36-pole"], quantity: 0, unit: "each" },
    { id: "sv4", groupName: "Fittings", description: "Junction Box", spec: "Standard", quantity: 0, unit: "each" },
    { id: "sv5", groupName: "Accessories", description: "Cable Clips", spec: "20mm", quantity: 0, unit: "pack" },
  ],
  "Decking / Pergola / Outdoor": [
    { id: "d1", groupName: "Structural Posts", description: "Post", spec: "90x90mm H4 Treated", specOptions: ["90x90mm H4 Treated", "115x115mm H4 Treated", "140x140mm H4 Treated"], quantity: 0, unit: "each" },
    { id: "d2", groupName: "Bearers & Joists", description: "Bearer", spec: "140x45mm H3 Treated", specOptions: ["90x45mm H3 Treated", "140x45mm H3 Treated", "190x45mm H3 Treated"], quantity: 0, unit: "m" },
    { id: "d3", groupName: "Bearers & Joists", description: "Joist", spec: "90x45mm H3 Treated", specOptions: ["70x45mm H3 Treated", "90x45mm H3 Treated", "140x45mm H3 Treated"], quantity: 0, unit: "m" },
    { id: "d4", groupName: "Decking Boards", description: "Decking Board", spec: "90x22mm Merbau", specOptions: ["90x22mm Merbau", "90x22mm Spotted Gum", "138x23mm Composite"], quantity: 0, unit: "m" },
    { id: "d5", groupName: "Stirrup Anchors", description: "Post Stirrup", spec: "90mm", specOptions: ["90mm", "115mm", "140mm"], quantity: 0, unit: "each" },
    { id: "d6", groupName: "Fixings", description: "Decking Screw", spec: "10g x 65mm SS", quantity: 0, unit: "box" },
    { id: "d7", groupName: "Fixings", description: "Coach Bolt", spec: "M12x150mm", quantity: 0, unit: "each" },
    { id: "d8", groupName: "Accessories", description: "Joist Hanger", spec: "Standard", quantity: 0, unit: "each" },
  ],
  "Windows & Doors": [
    { id: "wd1", groupName: "Windows", description: "Sliding Window", spec: "1800x900mm", specOptions: ["600x600mm", "1200x900mm", "1800x900mm", "2100x1200mm"], quantity: 0, unit: "each" },
    { id: "wd2", groupName: "Windows", description: "Awning Window", spec: "600x600mm", specOptions: ["600x600mm", "900x600mm", "1200x600mm"], quantity: 0, unit: "each" },
    { id: "wd3", groupName: "External Doors", description: "Entry Door", spec: "2040x820mm Solid Core", specOptions: ["2040x820mm Solid Core", "2040x920mm Solid Core"], quantity: 0, unit: "each" },
    { id: "wd4", groupName: "Internal Doors", description: "Internal Door", spec: "2040x820mm Hollow Core", specOptions: ["2040x720mm Hollow Core", "2040x820mm Hollow Core"], quantity: 0, unit: "each" },
    { id: "wd5", groupName: "Hardware & Locks", description: "Lever Handle Set", spec: "Passage", specOptions: ["Passage", "Privacy", "Entrance"], quantity: 0, unit: "each" },
    { id: "wd6", groupName: "Weatherseals", description: "Door Seal", spec: "Standard", quantity: 0, unit: "m" },
    { id: "wd7", groupName: "Accessories", description: "Door Stop", spec: "Floor mount", quantity: 0, unit: "each" },
  ],
  "Insulation / Sarking / Wraps": [
    { id: "in1", groupName: "Wall Batts", description: "Wall Insulation Batt", spec: "R2.0 — 90mm", specOptions: ["R1.5 — 70mm", "R2.0 — 90mm", "R2.5 — 90mm"], quantity: 0, unit: "pack" },
    { id: "in2", groupName: "Ceiling Batts", description: "Ceiling Insulation Batt", spec: "R4.0 — 190mm", specOptions: ["R3.0 — 155mm", "R3.5 — 175mm", "R4.0 — 190mm", "R5.0 — 220mm"], quantity: 0, unit: "pack" },
    { id: "in3", groupName: "Roof Sarking", description: "Roof Sarking", spec: "Standard reflective", specOptions: ["Standard reflective", "Heavy duty reflective"], quantity: 0, unit: "roll" },
    { id: "in4", groupName: "Wall Wrap / Vapour Barrier", description: "Wall Wrap", spec: "Standard", quantity: 0, unit: "roll" },
    { id: "in5", groupName: "Tape & Accessories", description: "Sarking Tape", spec: "48mm x 30m", quantity: 0, unit: "roll" },
  ],
};

function getItemsForStage(stage: string, groupNames: string[]): LineItem[] {
  const stageItems = STAGE_LINE_ITEMS[stage];
  if (!stageItems) {
    // For custom/unknown stages, generate generic items from group names
    return groupNames.map((name, i) => ({
      id: `gen-${i}`,
      groupName: name,
      description: name,
      spec: "",
      quantity: 0,
      unit: "each",
    }));
  }
  // Filter to only included groups
  const groupSet = new Set(groupNames);
  return stageItems.filter((item) => groupSet.has(item.groupName));
}

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
  const groupsParam = searchParams.get("groups") ?? "";
  const groupNames = groupsParam ? groupsParam.split(",") : [];

  const [items, setItems] = useState<LineItem[]>(() =>
    getItemsForStage(stage, groupNames),
  );
  const [addingItem, setAddingItem] = useState(false);
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemGroup, setNewItemGroup] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("each");

  const handleQuantityChange = (id: string, value: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, value) } : item,
      ),
    );
  };

  const handleSpecChange = (id: string, spec: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, spec } : item)),
    );
  };

  const handleAddItem = () => {
    if (!newItemDesc.trim()) return;
    const group = newItemGroup.trim() || groupNames[0] || "Custom";
    setItems((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        groupName: group,
        description: newItemDesc.trim(),
        spec: "",
        quantity: 0,
        unit: newItemUnit,
      },
    ]);
    setNewItemDesc("");
    setNewItemGroup("");
    setNewItemUnit("each");
    setAddingItem(false);
  };

  const grouped = groupItems(items);

  return (
    <div className="screen line-items">
      <header>
        <Button
          variant="secondary"
          onClick={() =>
            navigate(
              `/projects/${projectId}/components?stage=${encodeURIComponent(stage)}`,
            )
          }
        >
          ← Back to Groups
        </Button>
        <h2>Line Item Selection</h2>
      </header>

      <p className="hint">
        Define specifications and quantities for each material group. All
        quantities start at 0 — enter the amounts you require.
      </p>

      {Array.from(grouped.entries()).map(([groupName, groupItems]) => (
        <Card key={groupName}>
          <h3>{groupName}</h3>
          <div className="line-items-list">
            {groupItems.map((item) => (
              <div key={item.id} className="line-item-row">
                <div className="line-item-info">
                  <strong>{item.description}</strong>
                  {item.specOptions && item.specOptions.length > 1 ? (
                    <select
                      className="bq-select"
                      value={item.spec}
                      onChange={(e) => handleSpecChange(item.id, e.target.value)}
                    >
                      {item.specOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="hint">{item.spec}</span>
                  )}
                </div>
                <div className="line-item-controls">
                  <input
                    type="number"
                    className="bq-input line-item-qty"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.id,
                        parseInt(e.target.value) || 0,
                      )
                    }
                    min={0}
                    placeholder="0"
                  />
                  <span className="line-item-unit">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      {addingItem ? (
        <Card>
          <h3>Add Item</h3>
          <div className="field">
            <label className="bq-text-field">
              <span>Description</span>
              <input
                type="text"
                className="bq-input"
                value={newItemDesc}
                onChange={(e) => setNewItemDesc(e.target.value)}
                placeholder="Item description"
                autoFocus
              />
            </label>
          </div>
          <div className="field">
            <label className="bq-text-field">
              <span>Group</span>
              <select
                className="bq-select"
                value={newItemGroup}
                onChange={(e) => setNewItemGroup(e.target.value)}
              >
                <option value="">Select group</option>
                {groupNames.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
                <option value="Custom">Custom</option>
              </select>
            </label>
          </div>
          <div className="field">
            <label className="bq-text-field">
              <span>Unit</span>
              <select
                className="bq-select"
                value={newItemUnit}
                onChange={(e) => setNewItemUnit(e.target.value)}
              >
                <option value="each">each</option>
                <option value="m">m</option>
                <option value="m²">m²</option>
                <option value="m³">m³</option>
                <option value="sheets">sheets</option>
                <option value="roll">roll</option>
                <option value="pack">pack</option>
                <option value="box">box</option>
                <option value="bag">bag</option>
              </select>
            </label>
          </div>
          <div className="actions">
            <Button variant="secondary" onClick={() => setAddingItem(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem} disabled={!newItemDesc.trim()}>
              Add
            </Button>
          </div>
        </Card>
      ) : (
        <Button
          variant="secondary"
          className="add-group-btn"
          onClick={() => setAddingItem(true)}
        >
          + Add another item
        </Button>
      )}

      <StickyFooter>
        <Button
          onClick={() =>
            navigate(
              `/projects/${projectId}/review?stage=${encodeURIComponent(stage)}`,
            )
          }
        >
          Continue to Review
        </Button>
      </StickyFooter>
    </div>
  );
}
