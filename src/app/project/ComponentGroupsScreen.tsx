// S4 — Suggested Component Groups
// READS: AI suggestions → componentGroups, existing componentGroups
// WRITES: componentGroups (toggle, add)
// AI RULES: classification only — never adds quantities, never auto-includes silently

import { useNavigate, useParams } from "react-router-dom";
import { ComponentGroupList } from "../../components/ComponentGroupList";
import type { Id } from "../../../convex/_generated/dataModel";

export function ComponentGroupsScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  // TODO: wire to Convex queries/mutations
  const groups: Parameters<typeof ComponentGroupList>[0]["groups"] = [];

  const handleToggle = (_groupId: Id<"componentGroups">, _included: boolean) => {
    // TODO: call toggleGroupIncluded mutation
  };

  const handleAddGroup = (_name: string) => {
    // TODO: call addGroup mutation
  };

  return (
    <div className="screen component-groups">
      <header>
        <button className="btn secondary" onClick={() => navigate(`/project/${projectId}/scope`)}>
          ← Scope
        </button>
        <h2>Material Groups</h2>
      </header>

      <ComponentGroupList
        groups={groups}
        onToggle={handleToggle}
        onAddGroup={handleAddGroup}
      />

      <button className="btn primary" onClick={() => navigate(`/project/${projectId}/build-up`)}>
        Continue
      </button>
    </div>
  );
}
