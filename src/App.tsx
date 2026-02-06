import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardScreen } from "./app/dashboard/DashboardScreen";
import { ProjectSetupScreen } from "./app/project/ProjectSetupScreen";
import { ScopeInputScreen } from "./app/project/ScopeInputScreen";
import { ComponentGroupsScreen } from "./app/project/ComponentGroupsScreen";
import { BuildUpScreen } from "./app/project/BuildUpScreen";
import { ReviewScreen } from "./app/project/ReviewScreen";
import { PreviewScreen } from "./app/project/PreviewScreen";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* S1 — Builder Dashboard */}
        <Route path="/" element={<DashboardScreen />} />

        {/* S2 — Project Setup */}
        <Route path="/project/new" element={<ProjectSetupScreen />} />

        {/* S3 — Scope Input */}
        <Route path="/project/:projectId/scope" element={<ScopeInputScreen />} />

        {/* S4 — Component Groups */}
        <Route
          path="/project/:projectId/materials"
          element={<ComponentGroupsScreen />}
        />

        {/* S5 — Build-Up (Core Screen) */}
        <Route
          path="/project/:projectId/build-up"
          element={<BuildUpScreen />}
        />

        {/* S6 — Review & Supplier Details */}
        <Route
          path="/project/:projectId/review"
          element={<ReviewScreen />}
        />

        {/* S7 — RFQ Preview & Send */}
        <Route
          path="/project/:projectId/preview"
          element={<PreviewScreen />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
