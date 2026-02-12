// S1 — Landing Page
import { useAuth } from "@clerk/clerk-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function LandingPage() {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <div className="screen landing-screen">
      <Card className="landing-hero">
        <p className="landing-eyebrow">BuildQuote</p>
        <h1>Structured RFQs for professional builders.</h1>
        <p className="hint">
          From project setup to supplier-ready quote requests — structure your
          scope, select materials, and send RFQs in one calm, builder-led
          workflow.
        </p>

        <div className="landing-actions">
          <Button to={isLoaded && isSignedIn ? "/dashboard" : "/sign-in"}>
            {isLoaded && isSignedIn ? "Open Dashboard" : "Sign In"}
          </Button>
          <Button variant="secondary" to="/sign-up">
            Create Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
