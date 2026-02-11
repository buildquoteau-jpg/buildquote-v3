// Newsletter opt-in checkbox — reusable component
interface NewsletterOptInProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function NewsletterOptIn({
  checked,
  onChange,
  disabled,
}: NewsletterOptInProps) {
  return (
    <div className="newsletter-optin">
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span>
          Send me occasional BuildQuote updates and relevant industry news.
        </span>
      </label>
      <p className="hint">Unsubscribe anytime in Settings.</p>
    </div>
  );
}
