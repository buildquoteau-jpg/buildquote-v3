import { useState } from "react";

export function DisclaimerBlock() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="disclaimer-block">
      <button
        className="disclaimer-toggle"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "▸" : "▾"} Important information
      </button>
      {!collapsed && (
        <p className="disclaimer-text">
          BuildQuote assists with structuring material quote requests only. It
          does not make engineering, compliance, quantity, or suitability
          decisions. All selections must be reviewed and confirmed by the builder
          and relevant professionals.
        </p>
      )}
    </div>
  );
}
