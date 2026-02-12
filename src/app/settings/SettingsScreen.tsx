// Settings — Billing + Account
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export function SettingsScreen() {
  const navigate = useNavigate();

  return (
    <div className="screen settings-screen">
      <header>
        <Button variant="secondary" onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </Button>
        <h2>Settings</h2>
      </header>

      <Card>
        <section className="settings-section">
          <h3>Account</h3>
          <p className="hint">Manage your account details and authentication preferences.</p>
          <Button variant="secondary" to="/profile">
            Edit Profile
          </Button>
        </section>
      </Card>

      <Card>
        <section className="settings-section">
          <h3>Billing</h3>
          <p className="hint">Billing and subscription management will be available here.</p>
        </section>
      </Card>

      <Card>
        <section className="settings-section">
          <h3>Notifications</h3>
          <p className="hint">Email notification preferences will be configurable here.</p>
        </section>
      </Card>
    </div>
  );
}
