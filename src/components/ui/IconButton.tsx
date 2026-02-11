import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export function IconButton({ children, className, ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button {...props} className={["bq-icon-button", className].filter(Boolean).join(" ")}>
      {children}
    </button>
  );
}
