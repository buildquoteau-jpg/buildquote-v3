import type { InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
}

export function TextField({ label, helperText, id, ...props }: TextFieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="bq-text-field" htmlFor={inputId}>
      <span className="bq-text-field-label">{label}</span>
      <input id={inputId} className="bq-text-field-input" {...props} />
      {helperText ? <span className="bq-text-field-helper">{helperText}</span> : null}
    </label>
  );
}
