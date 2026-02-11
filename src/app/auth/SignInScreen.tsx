import { SignIn, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PasskeyButton } from "../../components/PasskeyButton";
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
    passkeyButton?.click();
  };

  return (
    <div className="screen sign-in-screen">
      <div className="sign-in-container bq-card">
        <h1>Sign in to BuildQuote</h1>

        <PasskeyButton onSignIn={handlePasskeySignIn} />

        <div className="sign-in-divider">
          <span>or sign in with email</span>
        </div>

        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
      </div>
    </div>
  );
}
