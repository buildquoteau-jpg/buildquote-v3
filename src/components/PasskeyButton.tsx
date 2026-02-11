import { useState } from "react";
import { Button } from "./ui/Button";

interface PasskeyButtonProps {
  onSignIn: () => void;
  disabled?: boolean;
}

function supportsPasskeys(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.PublicKeyCredential !== "undefined"
  );
}

export function PasskeyButton({ onSignIn, disabled }: PasskeyButtonProps) {
  const [supported] = useState(supportsPasskeys());

  if (!supported) {
    return (
      <p className="hint passkey-unsupported">
        Face ID / Passkey sign-in is not supported on this device or browser.
      </p>
    );
  }

  return (
    <Button
      type="button"
      className="passkey-btn"
      variant="secondary"
      onClick={onSignIn}
      disabled={disabled}
    >
      Sign in with Face ID / Passkey
    </Button>
  );
}
