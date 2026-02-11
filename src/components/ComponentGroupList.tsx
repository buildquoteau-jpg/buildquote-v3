import type { Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/Button";

interface ComponentGroup {
  _id: Id<"componentGroups">;
  name: string;
  source: "ai_suggested" | "builder_added";
  included: boolean;
  orderIndex: number;
}

interface ComponentGroupListProps {
  groups: ComponentGroup[];
  onToggle: (groupId: Id<"componentGroups">, included: boolean) => void;
  onAddGroup: (name: string) => void;
}

export function ComponentGroupList({ groups, onToggle, onAddGroup }: ComponentGroupListProps) {
  const sorted = [...groups].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="component-group-list">
      <p className="intro hint">
        Based on your scope, the following material groups are typically included.
        Untick any that do not apply, or add a group if required.
      </p>
      {sorted.map((group) => (
        <label key={group._id} className="group-row">
          <input
            type="checkbox"
            checked={group.included}
            onChange={(e) => onToggle(group._id, e.target.checked)}
          />
          <span>{group.name}</span>
        </label>
      ))}
      <Button
        className="add-group-btn"
        variant="secondary"
        onClick={() => {
          const name = prompt("Component group name:");
          if (name) onAddGroup(name);
        }}
      >
        + Add component group
      </Button>
    </div>
  );
}
