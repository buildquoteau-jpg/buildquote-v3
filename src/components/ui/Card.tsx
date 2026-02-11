import type { HTMLAttributes, PropsWithChildren } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  compact?: boolean;
  as?: "section" | "article" | "div" | "aside";
}

export function Card({
  children,
  className = "",
  compact,
  as = "section",
  ...props
}: PropsWithChildren<CardProps>) {
  const Tag = as;
  return (
    <Tag
      className={`bq-card ${compact ? "bq-card--compact" : ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  );
}
