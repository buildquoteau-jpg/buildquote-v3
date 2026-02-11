import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export function IconButton({
  children,
  className = "",
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button className={`bq-icon-btn ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
