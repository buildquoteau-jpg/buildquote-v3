import { useAuth } from "@clerk/clerk-react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useParams } from "react-router-dom";
import { DashboardScreen } from "./app/dashboard/DashboardScreen";
import { ExistingProjectScreen } from "./app/project/ExistingProjectScreen";
import { ProjectSetupScreen } from "./app/project/ProjectSetupScreen";
import { ScopeInputScreen } from "./app/project/ScopeInputScreen";
import { ComponentGroupsScreen } from "./app/project/ComponentGroupsScreen";
import { BuildUpScreen } from "./app/project/BuildUpScreen";
import { ReviewScreen } from "./app/project/ReviewScreen";
import { PreviewScreen } from "./app/project/PreviewScreen";
import { PlaceholderScreen } from "./app/navigation/PlaceholderScreen";
import { SettingsScreen } from "./app/settings/SettingsScreen";
import { ManufacturerDashboardScreen } from "./app/manufacturer/ManufacturerDashboardScreen";
import { ManufacturerSystemsListScreen } from "./app/manufacturer/systems/ManufacturerSystemsListScreen";
import { NewManufacturerSystemScreen } from "./app/manufacturer/systems/NewManufacturerSystemScreen";
import { ManufacturerSystemDetailScreen } from "./app/manufacturer/systems/ManufacturerSystemDetailScreen";
import { ManufacturerDocumentsListScreen } from "./app/manufacturer/documents/ManufacturerDocumentsListScreen";
import { ManufacturerDocumentUploadScreen } from "./app/manufacturer/documents/ManufacturerDocumentUploadScreen";
import { ReviewQueueScreen } from "./app/admin/ReviewQueueScreen";
import { DevPanelScreen } from "./app/dev/DevPanelScreen";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import "./App.css";

function RootRedirect() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="screen">Loading...</div>;
  }

  return <Navigate to={isSignedIn ? "/app" : "/sign-in"} replace />;
}

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

function LegacyProjectRedirect({ step }: { step: string }) {
  const { projectId } = useParams<{ projectId: string }>();
  if (!projectId) {
    return <Navigate to="/app/project/new" replace />;
  }
  return <Navigate to={`/app/project/${projectId}/${step}`} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        <Route path="/app" element={<ProtectedAppRoute />}>
          <Route index element={<DashboardScreen />} />

          <Route
            path="suppliers"
            element={
              <PlaceholderScreen
                title="Suppliers"
                description="Supplier management is not configured yet."
              />
            }
          />
          <Route
            path="library"
            element={
              <PlaceholderScreen
                title="Library"
                description="Reference materials and templates will appear here."
              />
            }
          />
          <Route
            path="profile"
            element={
              <PlaceholderScreen
                title="Profile"
                description="Profile details and account controls will appear here."
              />
            }
          />

          <Route path="project/new" element={<ProjectSetupScreen />} />
          <Route path="project/existing" element={<ExistingProjectScreen />} />
          <Route path="project/:projectId/scope" element={<ScopeInputScreen />} />
          <Route path="project/:projectId/materials" element={<ComponentGroupsScreen />} />
          <Route path="project/:projectId/build-up" element={<BuildUpScreen />} />
          <Route path="project/:projectId/review" element={<ReviewScreen />} />
          <Route path="project/:projectId/preview" element={<PreviewScreen />} />

          <Route path="settings" element={<SettingsScreen />} />

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

        {/* Legacy URL redirects */}
        <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
        <Route path="/suppliers" element={<Navigate to="/app/suppliers" replace />} />
        <Route path="/library" element={<Navigate to="/app/library" replace />} />
        <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
        <Route path="/project/new" element={<Navigate to="/app/project/new" replace />} />
        <Route path="/project/existing" element={<Navigate to="/app/project/existing" replace />} />
        <Route path="/project/:projectId/scope" element={<LegacyProjectRedirect step="scope" />} />
        <Route
          path="/project/:projectId/materials"
          element={<LegacyProjectRedirect step="materials" />}
        />
        <Route
          path="/project/:projectId/build-up"
          element={<LegacyProjectRedirect step="build-up" />}
        />
        <Route path="/project/:projectId/review" element={<LegacyProjectRedirect step="review" />} />
        <Route path="/project/:projectId/preview" element={<LegacyProjectRedirect step="preview" />} />
        <Route path="/manufacturer" element={<Navigate to="/app/manufacturer" replace />} />
        <Route path="/manufacturer/systems" element={<Navigate to="/app/manufacturer/systems" replace />} />
        <Route
          path="/manufacturer/systems/new"
          element={<Navigate to="/app/manufacturer/systems/new" replace />}
        />
        <Route
          path="/manufacturer/systems/:systemMappingId"
          element={<Navigate to="/app/manufacturer/systems" replace />}
        />
        <Route
          path="/manufacturer/documents"
          element={<Navigate to="/app/manufacturer/documents" replace />}
        />
        <Route
          path="/manufacturer/documents/upload"
          element={<Navigate to="/app/manufacturer/documents/upload" replace />}
        />
        <Route path="/admin/review" element={<Navigate to="/app/admin/review" replace />} />
        <Route path="/dev" element={<Navigate to="/app/dev" replace />} />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
