import { useNavigate } from "react-router-dom";
import { Button, Card } from "../../components/ui";

export function BuilderProfileScreen() {
  const navigate = useNavigate();
  const builder = { companyName: "Southwest Constructions", logoUrl: "" };

  return (
    <div className="screen">
      <header className="dashboard-header">
        <Button variant="ghost" onClick={() => navigate("/")}>← Projects</Button>
        <h2>Builder Profile</h2>
      </header>
      <Card>
        <h3>{builder.companyName}</h3>
        <p className="bq-hint">Company details and logo controls live here.</p>
        {builder.logoUrl ? <img src={builder.logoUrl} alt="Builder logo" className="dashboard-logo" /> : null}
      </Card>
    </div>
  );
}
