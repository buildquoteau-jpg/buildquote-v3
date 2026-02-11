import { SignIn, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PasskeyButton } from "../../components/PasskeyButton";
import { Card } from "../../components/ui/Card";
import "./auth.css";

export function SignInScreen() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  const handlePasskeySignIn = () => {
    const passkeyButton = document.querySelector<HTMLButtonElement>(
      '[data-localization-key="signIn.start.actionLink__use_passkey"]'
    );
    if (passkeyButton) {
      passkeyButton.click();
    }
  };

  return (
    <div className="screen sign-in-screen">
      <Card className="sign-in-container">
        <h1>Sign in to BuildQuote</h1>

        <PasskeyButton onSignIn={handlePasskeySignIn} />

        <div className="sign-in-divider">
          <span>or sign in with email</span>
        </div>

        <SignIn
          appearance={{
            elements: {
              rootBox: "clerk-root",
              card: "clerk-card",
            },
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
        />

        <p className="hint sign-in-footer">
          Passkeys use Face ID, Touch ID, or your device PIN for secure,
          passwordless sign-in.
        </p>
      </Card>
    </div>
  );
}
