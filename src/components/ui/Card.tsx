import type { HTMLAttributes, PropsWithChildren } from "react";

export function Card({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={["bq-card", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}
