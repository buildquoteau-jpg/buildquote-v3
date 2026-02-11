// S5 — Quote Builder (Specifications & Quantities)
// OWNS: builder-controlled line-item definition for supplier-ready quote requests.
// DOES NOT DECIDE: automatic specs, quantities, pricing, or send actions.
// ⚠️ This is the core screen of BuildQuote. Everything else supports this.
// READS: componentGroups, lineItems
// WRITES: lineItems (add, update, remove)
// AI RULES: inline suggestions only — never auto-edit
// LAYOUT: single scrollable screen, no wizard, no forced sequencing

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DisclaimerBlock } from "../../components/DisclaimerBlock";
import { AddMoreGate } from "../../components/AddMoreGate";

export function BuildUpScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [showAddMoreGate, setShowAddMoreGate] = useState(false);

  return (
    <div className="screen build-up">
      <header>
        <button className="btn secondary" onClick={() => navigate(`/project/${projectId}/materials`)}>
          ← Materials
        </button>
        <h2>Request Build-Up</h2>
      </header>

      <p className="hint">
        Define specifications and quantities for each material group. You can
        scroll up or down and revise at any time.
      </p>

      <div className="build-up-placeholder">
        <p>Component groups and line items will render here.</p>
      </div>

      <DisclaimerBlock />

      {showAddMoreGate ? (
        <AddMoreGate
          onAddScope={() => navigate(`/project/${projectId}/scope`)}
          onAddLineItem={() => {
            setShowAddMoreGate(false);
          }}
          onContinue={() => navigate(`/project/${projectId}/review`)}
        />
      ) : (
        <button className="btn primary" onClick={() => setShowAddMoreGate(true)}>
          Continue
        </button>
      )}
    </div>
  );
}
