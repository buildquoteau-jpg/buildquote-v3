interface AddMoreGateProps {
  onAddScope: () => void;
  onAddLineItem: () => void;
  onContinue: () => void;
}

export function AddMoreGate({
  onAddScope,
  onAddLineItem,
  onContinue,
}: AddMoreGateProps) {
  return (
    <div className="add-more-gate">
      <h3>Anything else to include?</h3>
      <div className="gate-actions">
        <button className="gate-btn secondary" onClick={onAddScope}>
          Add another scope / system
        </button>
        <button className="gate-btn secondary" onClick={onAddLineItem}>
          Add a single missed item
        </button>
        <button className="gate-btn primary" onClick={onContinue}>
          Continue to review
        </button>
      </div>
    </div>
  );
}
