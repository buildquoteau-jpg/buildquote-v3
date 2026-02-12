import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import "./settings.css";

export function SettingsScreen() {
  const navigate = useNavigate();

  return (
    <div className="screen settings-screen">
      <header>
        <Button variant="secondary" onClick={() => navigate("/")}>
          Back to dashboard
        </Button>
        <h2>Settings</h2>
      </header>

      <Card className="settings-section">
        <h3>Profile</h3>
        <p className="hint">Builder profile details and logo controls.</p>
        <div className="settings-row">
          <Button variant="secondary" to="/profile">
            Open profile
          </Button>
        </div>
      </Card>

      <Card className="settings-section">
        <h3>Billing</h3>
        <p className="hint">Billing preferences and invoices will appear here.</p>
      </Card>

      <Card className="settings-section">
        <h3>Sign out</h3>
        <p className="hint">Return to the sign-in screen.</p>
        <div className="settings-row">
          <Button variant="secondary" to="/sign-in">
            Go to sign in
          </Button>
        </div>
      </Card>
    </div>
  );
}
