import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardScreen } from "./app/dashboard/DashboardScreen";
import { ExistingProjectScreen } from "./app/project/ExistingProjectScreen";
import { ProjectSetupScreen } from "./app/project/ProjectSetupScreen";
import { ScopeInputScreen } from "./app/project/ScopeInputScreen";
import { ComponentGroupsScreen } from "./app/project/ComponentGroupsScreen";
import { BuildUpScreen } from "./app/project/BuildUpScreen";
import { ReviewScreen } from "./app/project/ReviewScreen";
import { PreviewScreen } from "./app/project/PreviewScreen";
import { SignInScreen } from "./app/auth/SignInScreen";
import { SettingsScreen } from "./app/settings/SettingsScreen";
import { BuilderProfileScreen } from "./app/profile/BuilderProfileScreen";
import { BuilderLibraryScreen } from "./app/library/BuilderLibraryScreen";
import { SupplierLibraryScreen } from "./app/suppliers/SupplierLibraryScreen";
import { DevChecklistScreen } from "./app/dev/DevChecklistScreen";
import { ManufacturerDashboardScreen } from "./app/manufacturer/ManufacturerDashboardScreen";
import { ManufacturerSystemsListScreen } from "./app/manufacturer/systems/ManufacturerSystemsListScreen";
import { NewManufacturerSystemScreen } from "./app/manufacturer/systems/NewManufacturerSystemScreen";
import { ManufacturerSystemDetailScreen } from "./app/manufacturer/systems/ManufacturerSystemDetailScreen";
import { ManufacturerDocumentsListScreen } from "./app/manufacturer/documents/ManufacturerDocumentsListScreen";
import { ManufacturerDocumentUploadScreen } from "./app/manufacturer/documents/ManufacturerDocumentUploadScreen";
import { ReviewQueueScreen } from "./app/admin/ReviewQueueScreen";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in/*" element={<SignInScreen />} />
        <Route path="/" element={<DashboardScreen />} />
        <Route path="/builder-profile" element={<BuilderProfileScreen />} />
        <Route path="/builder-library" element={<BuilderLibraryScreen />} />
        <Route path="/supplier-library" element={<SupplierLibraryScreen />} />
        <Route path="/project/new" element={<ProjectSetupScreen />} />
        <Route path="/project/existing" element={<ExistingProjectScreen />} />
        <Route path="/project/:projectId/scope" element={<ScopeInputScreen />} />
        <Route path="/project/:projectId/materials" element={<ComponentGroupsScreen />} />
        <Route path="/project/:projectId/build-up" element={<BuildUpScreen />} />
        <Route path="/project/:projectId/review" element={<ReviewScreen />} />
        <Route path="/project/:projectId/preview" element={<PreviewScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/dev-checklist" element={<DevChecklistScreen />} />
        <Route path="/manufacturer" element={<ManufacturerDashboardScreen />} />
        <Route path="/manufacturer/systems" element={<ManufacturerSystemsListScreen />} />
        <Route path="/manufacturer/systems/new" element={<NewManufacturerSystemScreen />} />
        <Route path="/manufacturer/systems/:systemMappingId" element={<ManufacturerSystemDetailScreen />} />
        <Route path="/manufacturer/documents" element={<ManufacturerDocumentsListScreen />} />
        <Route path="/manufacturer/documents/upload" element={<ManufacturerDocumentUploadScreen />} />
        <Route path="/admin/review" element={<ReviewQueueScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
