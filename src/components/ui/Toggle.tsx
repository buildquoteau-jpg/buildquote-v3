interface ToggleOption<T extends string> {
  label: string;
  value: T;
}

interface ToggleProps<T extends string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function Toggle<T extends string>({ options, value, onChange }: ToggleProps<T>) {
  return (
    <div className="bq-toggle" role="tablist">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          data-active={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
