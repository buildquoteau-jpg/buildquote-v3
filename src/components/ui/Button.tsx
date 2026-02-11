import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

export function Button({
  variant = "secondary",
  loading,
  children,
  className,
  disabled,
  ...props
}: PropsWithChildren<ButtonProps>) {
  const cls = ["bq-button", `bq-button--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={cls} disabled={disabled || loading} {...props}>
      {loading ? <span className="bq-button__spinner" aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}
