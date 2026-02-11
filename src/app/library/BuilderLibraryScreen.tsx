import { Button, Card } from "../../components/ui";
import { useNavigate } from "react-router-dom";

export function BuilderLibraryScreen() {
  const navigate = useNavigate();
  return (
    <div className="screen">
      <header className="dashboard-header">
        <Button variant="ghost" onClick={() => navigate("/")}>← Projects</Button>
        <h2>Builder Library</h2>
      </header>
      <Card>
        <p>Saved builder items and guides will appear here.</p>
      </Card>
    </div>
  );
}
