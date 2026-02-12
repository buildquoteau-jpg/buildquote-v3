import { useAuth } from "@clerk/clerk-react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { DashboardScreen } from "./app/dashboard/DashboardScreen";
import { ExistingProjectScreen } from "./app/project/ExistingProjectScreen";
import { ProjectSetupScreen } from "./app/project/ProjectSetupScreen";
import { ScopeInputScreen } from "./app/project/ScopeInputScreen";
import { ComponentGroupsScreen } from "./app/project/ComponentGroupsScreen";
import { BuildUpScreen } from "./app/project/BuildUpScreen";
import { ReviewScreen } from "./app/project/ReviewScreen";
import { PreviewScreen } from "./app/project/PreviewScreen";
import { PlaceholderScreen } from "./app/navigation/PlaceholderScreen";
import { ManufacturerDashboardScreen } from "./app/manufacturer/ManufacturerDashboardScreen";
import { ManufacturerSystemsListScreen } from "./app/manufacturer/systems/ManufacturerSystemsListScreen";
import { NewManufacturerSystemScreen } from "./app/manufacturer/systems/NewManufacturerSystemScreen";
import { ManufacturerSystemDetailScreen } from "./app/manufacturer/systems/ManufacturerSystemDetailScreen";
import { ManufacturerDocumentsListScreen } from "./app/manufacturer/documents/ManufacturerDocumentsListScreen";
import { ManufacturerDocumentUploadScreen } from "./app/manufacturer/documents/ManufacturerDocumentUploadScreen";
import { ReviewQueueScreen } from "./app/admin/ReviewQueueScreen";
import { DevPanelScreen } from "./app/dev/DevPanelScreen";
import { SuppliersScreen } from "./app/suppliers/SuppliersScreen";
import { SupplierLibraryScreen } from "./app/suppliers/SupplierLibraryScreen";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { LandingPage } from "./pages/LandingPage";
import "./App.css";

function ProtectedAppRoute() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="screen">Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        <Route path="/app" element={<ProtectedAppRoute />}>
          <Route index element={<DashboardScreen />} />

          <Route path="suppliers" element={<SuppliersScreen />} />
          <Route path="library" element={<SupplierLibraryScreen />} />
          <Route
            path="profile"
            element={
              <PlaceholderScreen
                title="Profile"
                description="Profile and account preferences will appear here."
              />
            }
          />
          <Route path="settings" element={<Navigate to="/app/profile" replace />} />

          <Route path="project/new" element={<ProjectSetupScreen />} />
          <Route path="project/existing" element={<ExistingProjectScreen />} />
          <Route path="project/:projectId/setup" element={<ProjectSetupScreen />} />
          <Route path="project/:projectId/scope" element={<ScopeInputScreen />} />
          <Route path="project/:projectId/materials" element={<ComponentGroupsScreen />} />
          <Route path="project/:projectId/build-up" element={<BuildUpScreen />} />
          <Route path="project/:projectId/review" element={<ReviewScreen />} />
          <Route path="project/:projectId/preview" element={<PreviewScreen />} />

          <Route path="manufacturer" element={<ManufacturerDashboardScreen />} />
          <Route path="manufacturer/systems" element={<ManufacturerSystemsListScreen />} />
          <Route path="manufacturer/systems/new" element={<NewManufacturerSystemScreen />} />
          <Route
            path="manufacturer/systems/:systemMappingId"
            element={<ManufacturerSystemDetailScreen />}
          />
          <Route
            path="manufacturer/documents"
            element={<ManufacturerDocumentsListScreen />}
          />
          <Route
            path="manufacturer/documents/upload"
            element={<ManufacturerDocumentUploadScreen />}
          />

          <Route path="admin/review" element={<ReviewQueueScreen />} />
          <Route path="dev" element={<DevPanelScreen />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
