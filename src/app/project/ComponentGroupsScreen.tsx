// S4 — Suggested Component Groups
import { useNavigate, useParams } from "react-router-dom";
import { ComponentGroupList } from "../../components/ComponentGroupList";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StickyFooter } from "../../components/ui/StickyFooter";
import type { Id } from "../../../convex/_generated/dataModel";

export function ComponentGroupsScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const groups: Parameters<typeof ComponentGroupList>[0]["groups"] = [];

  const handleToggle = (groupId: Id<"componentGroups">, included: boolean) => {
    void groupId;
    void included;
  };

  const handleAddGroup = (name: string) => {
    void name;
  };

  return (
    <div className="screen component-groups">
      <header>
        <Button variant="secondary" onClick={() => navigate(`/app/project/${projectId}/scope`)}>
          ← Scope
        </Button>
        <h2>Material Groups</h2>
      </header>

      <Card>
        <ComponentGroupList
          groups={groups}
          onToggle={handleToggle}
          onAddGroup={handleAddGroup}
        />
      </Card>

      <StickyFooter>
        <Button onClick={() => navigate(`/app/project/${projectId}/build-up`)}>
          Continue
        </Button>
      </StickyFooter>
    </div>
  );
}
