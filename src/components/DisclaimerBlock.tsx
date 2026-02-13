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
          BuildQuote helps structure quote requests from the information
          provided. Engineering, compliance, quantities, and suitability remain
          the builder&apos;s responsibility and must be reviewed by relevant
          professionals.
        </p>
      )}
    </div>
  );
}
