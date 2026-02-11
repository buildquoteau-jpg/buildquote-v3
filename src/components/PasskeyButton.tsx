// Passkey sign-in CTA component
// Uses Clerk's passkey/WebAuthn flow when available
import { useState, useEffect } from "react";

interface PasskeyButtonProps {
  onSignIn: () => void;
  disabled?: boolean;
}

/**
 * Check if the browser supports WebAuthn / passkeys.
 */
function supportsPasskeys(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.PublicKeyCredential !== "undefined"
  );
}

export function PasskeyButton({ onSignIn, disabled }: PasskeyButtonProps) {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(supportsPasskeys());
  }, []);

  if (!supported) {
    return (
      <p className="hint passkey-unsupported">
        Face ID / Passkey sign-in is not supported on this device or browser.
      </p>
    );
  }

  return (
    <button
      type="button"
      className="btn secondary passkey-btn"
      onClick={onSignIn}
      disabled={disabled}
    >
      Sign in with Face ID / Passkey
    </button>
  );
}
