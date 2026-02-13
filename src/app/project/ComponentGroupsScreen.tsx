// S6 — Component Groups
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StickyFooter } from "../../components/ui/StickyFooter";

interface ComponentGroup {
  id: string;
  name: string;
  source: "ai_suggested" | "builder_added";
  included: boolean;
}

const STAGE_GROUPS: Record<string, string[]> = {
  "Slab / Footings": [
    "Reinforcement Mesh",
    "Chairs & Spacers",
    "Edge Form Timbers",
    "Concrete",
    "Vapour Barrier",
    "Accessories",
  ],
  "Wall Framing": [
    "Wall Frames",
    "Top & Bottom Plates",
    "Noggings",
    "Bracing",
    "Fasteners",
    "Accessories",
  ],
  "Roof Framing": [
    "Trusses",
    "Ridge Board & Rafters",
    "Battens",
    "Hardware & Connectors",
    "Fasteners",
    "Accessories",
  ],
  Roofing: [
    "Roofing Sheets",
    "Ridge Capping",
    "Flashings",
    "Gutters & Downpipes",
    "Fixings & Screws",
    "Accessories",
  ],
  "External Cladding": [
    "Cladding Sheets",
    "Cavity Battens",
    "Flashings",
    "Sealants",
    "Fixings",
    "Accessories",
  ],
  "Internal Linings": [
    "Plasterboard",
    "Cornices",
    "Jointing Compounds",
    "Screws & Fasteners",
    "Finishing Accessories",
  ],
  Services: [
    "Conduit",
    "Cable Trays",
    "Switchboard Components",
    "Fittings",
    "Accessories",
  ],
  "Decking / Pergola / Outdoor": [
    "Structural Posts",
    "Bearers & Joists",
    "Decking Boards",
    "Stirrup Anchors",
    "Fixings",
    "Accessories",
  ],
  "Windows & Doors": [
    "Windows",
    "External Doors",
    "Internal Doors",
    "Hardware & Locks",
    "Weatherseals",
    "Accessories",
  ],
  "Insulation / Sarking / Wraps": [
    "Wall Batts",
    "Ceiling Batts",
    "Roof Sarking",
    "Wall Wrap / Vapour Barrier",
    "Tape & Accessories",
  ],
};

function buildInitialGroups(stage: string): ComponentGroup[] {
  const names =
    STAGE_GROUPS[stage] ?? ["General Materials", "Fixings", "Accessories"];
  return names.map((name, i) => ({
    id: `group-${i}`,
    name,
    source: "ai_suggested",
    included: true,
  }));
}

export function ComponentGroupsScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const stage = searchParams.get("stage") ?? "";

  const [groups, setGroups] = useState<ComponentGroup[]>(() =>
    buildInitialGroups(stage),
  );
  const [addingGroup, setAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const handleToggle = (id: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, included: !g.included } : g)),
    );
  };

  const handleAddGroup = () => {
    if (!newGroupName.trim()) return;
    setGroups((prev) => [
      ...prev,
      {
        id: `group-custom-${Date.now()}`,
        name: newGroupName.trim(),
        source: "builder_added",
        included: true,
      },
    ]);
    setNewGroupName("");
    setAddingGroup(false);
  };

  const includedCount = groups.filter((g) => g.included).length;
  const includedNames = groups
    .filter((g) => g.included)
    .map((g) => g.name)
    .join(",");

  return (
    <div className="screen component-groups">
      <header>
        <Button
          variant="secondary"
          onClick={() =>
            navigate(
              `/projects/${projectId}/scope?stage=${encodeURIComponent(stage)}`,
            )
          }
        >
          ← Back to Scope
        </Button>
        <h2>Component Groups</h2>
      </header>

      <Card>
        <p className="hint">
          Based on your scope, the following material groups are typically
          included. Untick any that do not apply, or add a group if required.
        </p>

        <div className="component-group-list">
          {groups.map((group) => (
            <label key={group.id} className="group-row">
              <input
                type="checkbox"
                checked={group.included}
                onChange={() => handleToggle(group.id)}
              />
              <span>{group.name}</span>
              {group.source === "ai_suggested" ? (
                <span
                  className="bq-badge bq-badge--neutral"
                  style={{ marginLeft: "auto" }}
                >
                  Suggested
                </span>
              ) : null}
            </label>
          ))}
        </div>

        {addingGroup ? (
          <div className="add-group-inline">
            <input
              type="text"
              className="bq-input"
              placeholder="Component group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddGroup();
              }}
              autoFocus
            />
            <div className="actions">
              <Button
                variant="secondary"
                onClick={() => {
                  setAddingGroup(false);
                  setNewGroupName("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddGroup} disabled={!newGroupName.trim()}>
                Add
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className="add-group-btn"
            variant="secondary"
            onClick={() => setAddingGroup(true)}
          >
            + Add additional component group
          </Button>
        )}
      </Card>

      <StickyFooter>
        <Button
          disabled={includedCount === 0}
          onClick={() =>
            navigate(
              `/projects/${projectId}/items?stage=${encodeURIComponent(stage)}&groups=${encodeURIComponent(includedNames)}`,
            )
          }
        >
          Continue ({includedCount} groups)
        </Button>
      </StickyFooter>
    </div>
  );
}
