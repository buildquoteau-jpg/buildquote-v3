import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

type ButtonVariant = "primary" | "secondary" | "accent";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  to?: string;
}

export function Button({
  children,
  className = "",
  variant = "primary",
  to,
  ...props
}: PropsWithChildren<ButtonProps>) {
  const classes = `bq-btn bq-btn--${variant} ${className}`.trim();

  if (to) {
    return (
      <Link className={classes} to={to}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
