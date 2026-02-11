import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardScreen } from "./app/dashboard/DashboardScreen";
import { ExistingProjectScreen } from "./app/project/ExistingProjectScreen";
import { ProjectSetupScreen } from "./app/project/ProjectSetupScreen";
import { ScopeInputScreen } from "./app/project/ScopeInputScreen";
import { ComponentGroupsScreen } from "./app/project/ComponentGroupsScreen";
import { BuildUpScreen } from "./app/project/BuildUpScreen";
import { ReviewScreen } from "./app/project/ReviewScreen";
import { PreviewScreen } from "./app/project/PreviewScreen";

// Auth
import { SignInScreen } from "./app/auth/SignInScreen";

// Settings
import { SettingsScreen } from "./app/settings/SettingsScreen";

// Manufacturer Portal
import { ManufacturerDashboardScreen } from "./app/manufacturer/ManufacturerDashboardScreen";
import { ManufacturerSystemsListScreen } from "./app/manufacturer/systems/ManufacturerSystemsListScreen";
import { NewManufacturerSystemScreen } from "./app/manufacturer/systems/NewManufacturerSystemScreen";
import { ManufacturerSystemDetailScreen } from "./app/manufacturer/systems/ManufacturerSystemDetailScreen";
import { ManufacturerDocumentsListScreen } from "./app/manufacturer/documents/ManufacturerDocumentsListScreen";
import { ManufacturerDocumentUploadScreen } from "./app/manufacturer/documents/ManufacturerDocumentUploadScreen";

// Admin
import { ReviewQueueScreen } from "./app/admin/ReviewQueueScreen";
import { DevPanelScreen } from "./app/dev/DevPanelScreen";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Auth ── */}
        <Route path="/sign-in/*" element={<SignInScreen />} />

        {/* S1 — Builder Dashboard */}
        <Route path="/" element={<DashboardScreen />} />

        {/* S2 — Project Setup */}
        <Route path="/project/new" element={<ProjectSetupScreen />} />
        <Route path="/project/existing" element={<ExistingProjectScreen />} />

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

        {/* ── Settings ── */}
        <Route path="/settings" element={<SettingsScreen />} />

        {/* ── Manufacturer Portal ── */}
        <Route path="/manufacturer" element={<ManufacturerDashboardScreen />} />
        <Route path="/manufacturer/systems" element={<ManufacturerSystemsListScreen />} />
        <Route path="/manufacturer/systems/new" element={<NewManufacturerSystemScreen />} />
        <Route
          path="/manufacturer/systems/:systemMappingId"
          element={<ManufacturerSystemDetailScreen />}
        />
        <Route path="/manufacturer/documents" element={<ManufacturerDocumentsListScreen />} />
        <Route path="/manufacturer/documents/upload" element={<ManufacturerDocumentUploadScreen />} />

        {/* ── Admin ── */}
        <Route path="/admin/review" element={<ReviewQueueScreen />} />

        {/* ── Dev ── */}
        <Route path="/dev" element={<DevPanelScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
