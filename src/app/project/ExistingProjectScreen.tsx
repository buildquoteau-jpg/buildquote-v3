// S2b — Existing Project Picker
// READS: projects (list)
// WRITES: none
// AI RULES: no AI suggestions, no interpretation, no automation

import { useNavigate } from "react-router-dom";

export function ExistingProjectScreen() {
  const navigate = useNavigate();

  return (
    <div className="screen project-existing">
      <header>
        <button className="btn secondary" onClick={() => navigate("/")}>
          ← Dashboard
        </button>
        <h2>Add to Existing Project</h2>
      </header>
      <p>Select a project to continue building.</p>
      {/* TODO: project search + list */}
    </div>
  );
}
