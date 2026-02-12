import { useAuth } from "@clerk/clerk-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function LandingPage() {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <div className="screen landing-screen">
      <Card className="landing-hero">
        <p className="landing-eyebrow">BuildQuote</p>
        <h1>Builder-first quoting, from project setup to supplier-ready RFQs.</h1>
        <p className="hint">
          Save project setup drafts, capture site context, and move from scope to
          supplier outreach in one workflow.
        </p>

        <div className="landing-actions">
          <Button to={isLoaded && isSignedIn ? "/app" : "/sign-in"}>
            {isLoaded && isSignedIn ? "Open App" : "Sign In"}
          </Button>
          <Button variant="secondary" to="/sign-up">
            Create Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
