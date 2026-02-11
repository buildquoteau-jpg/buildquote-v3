interface ToggleOption<T extends string> {
  value: T;
  label: string;
}

interface ToggleProps<T extends string> {
  value: T;
  options: ToggleOption<T>[];
  onChange: (value: T) => void;
}

export function Toggle<T extends string>({ value, options, onChange }: ToggleProps<T>) {
  return (
    <div className="bq-toggle">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`bq-toggle-btn ${option.value === value ? "is-active" : ""}`.trim()}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
