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
  const supported = supportsPasskeys();

  if (!supported) {
    return (
      <p className="bq-hint passkey-unsupported">
        Face ID / Passkey sign-in is not supported on this device or browser.
      </p>
    );
  }

  return (
    <button
      type="button"
      className="bq-button bq-button--secondary passkey-btn"
      onClick={onSignIn}
      disabled={disabled}
    >
      Use Face ID / Passkey
    </button>
  );
}
