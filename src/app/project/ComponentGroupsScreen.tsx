// S4 — Suggested Component Groups
import { useNavigate, useParams } from "react-router-dom";
import { ComponentGroupList } from "../../components/ComponentGroupList";
import { Button, Card, StickyFooter } from "../../components/ui";
import type { Id } from "../../../convex/_generated/dataModel";

export function ComponentGroupsScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const groups: Parameters<typeof ComponentGroupList>[0]["groups"] = [];

  const handleToggle = (_groupId: Id<"componentGroups">, _included: boolean) => undefined;
  const handleAddGroup = (_name: string) => undefined;

  return (
    <div className="screen component-groups">
      <header>
        <Button variant="ghost" onClick={() => navigate(`/project/${projectId}/scope`)}>← Scope</Button>
        <h2>Material Groups</h2>
      </header>

      <Card>
        <ComponentGroupList groups={groups} onToggle={handleToggle} onAddGroup={handleAddGroup} />
      </Card>

      <StickyFooter>
        <Button variant="primary" onClick={() => navigate(`/project/${projectId}/build-up`)}>
          Continue
        </Button>
      </StickyFooter>
    </div>
  );
}
