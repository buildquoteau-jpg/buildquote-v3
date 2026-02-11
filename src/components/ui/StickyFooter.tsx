import type { PropsWithChildren } from "react";

export function StickyFooter({ children }: PropsWithChildren) {
  return <div className="bq-sticky-footer">{children}</div>;
}
