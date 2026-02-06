// S5 — Quote Builder (Specifications & Quantities)
// ⚠️ This is the core screen of BuildQuote. Everything else supports this.
// READS: componentGroups, lineItems
// WRITES: lineItems (add, update, remove)
// AI RULES: inline suggestions only — never auto-edit
// LAYOUT: single scrollable screen, no wizard, no forced sequencing

import { DisclaimerBlock } from "../../components/DisclaimerBlock";

export function BuildUpScreen() {
  // TODO: wire to Convex queries for componentGroups + lineItems
  // TODO: for each group, render driver item (if applicable) + line items + custom add

  return (
    <div className="screen build-up">
      <h2>Request Build-Up</h2>

      <p className="hint">
        Define specifications and quantities for each material group. You can
        scroll back and revise at any time.
      </p>

      {/* TODO: render component groups with their line items */}
      {/* Each group:
        [ Component Group Header ]
          ├─ Driver Item (if applicable)
          ├─ One or more Line Items (LineItemEditor)
          └─ + Add custom line item
      */}

      <DisclaimerBlock />

      <button className="btn primary">Continue</button>
    </div>
  );
}
