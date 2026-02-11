import { Button, Card } from "../../components/ui";
import { useNavigate } from "react-router-dom";

export function SupplierLibraryScreen() {
  const navigate = useNavigate();
  return (
    <div className="screen">
      <header className="dashboard-header">
        <Button variant="ghost" onClick={() => navigate("/")}>← Projects</Button>
        <h2>Supplier Library</h2>
      </header>
      <Card>
        <p>Supplier contacts, account references, trading terms, and notes.</p>
      </Card>
    </div>
  );
}
