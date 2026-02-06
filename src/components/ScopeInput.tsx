interface ScopeInputProps {
  value: string;
  onChange: (text: string) => void;
  stageSuggestion?: string;
}

export function ScopeInput({
  value,
  onChange,
  stageSuggestion,
}: ScopeInputProps) {
  return (
    <div className="scope-input">
      <label>Provide a brief scope of works for this quote request.</label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={stageSuggestion}
      />
      <p className="hint">1–2 sentences is usually enough.</p>
    </div>
  );
}
