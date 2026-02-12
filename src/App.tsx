import { useAuth } from "@clerk/clerk-react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { DashboardScreen } from "./app/dashboard/DashboardScreen";
import { ProjectSetupScreen } from "./app/project/ProjectSetupScreen";
import { ProjectOverviewScreen } from "./app/project/ProjectOverviewScreen";
import { StageSelectionScreen } from "./app/project/StageSelectionScreen";
import { ScopeInputScreen } from "./app/project/ScopeInputScreen";
import { ComponentGroupsScreen } from "./app/project/ComponentGroupsScreen";
import { LineItemsScreen } from "./app/project/LineItemsScreen";
import { SupplierSelectionScreen } from "./app/project/SupplierSelectionScreen";
import { RfqPreviewScreen } from "./app/project/RfqPreviewScreen";
import { SupplierTrackingScreen } from "./app/project/SupplierTrackingScreen";
import { SuppliersScreen } from "./app/suppliers/SuppliersScreen";
import { ProfileScreen } from "./app/settings/ProfileScreen";
import { DocumentLibraryScreen } from "./app/settings/DocumentLibraryScreen";
import { SettingsScreen } from "./app/settings/SettingsScreen";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { LandingPage } from "./pages/LandingPage";
import "./App.css";

function ProtectedRoute() {
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

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardScreen />} />

          <Route path="/projects/new" element={<ProjectSetupScreen />} />
          <Route path="/projects/:projectId" element={<ProjectOverviewScreen />} />
          <Route path="/projects/:projectId/edit" element={<ProjectSetupScreen />} />
          <Route path="/projects/:projectId/stages" element={<StageSelectionScreen />} />
          <Route path="/projects/:projectId/scope" element={<ScopeInputScreen />} />
          <Route path="/projects/:projectId/components" element={<ComponentGroupsScreen />} />
          <Route path="/projects/:projectId/items" element={<LineItemsScreen />} />
          <Route path="/projects/:projectId/suppliers" element={<SupplierSelectionScreen />} />
          <Route path="/projects/:projectId/preview" element={<RfqPreviewScreen />} />
          <Route path="/projects/:projectId/tracking" element={<SupplierTrackingScreen />} />

          <Route path="/quote/new" element={<Navigate to="/projects/new" replace />} />

          <Route path="/suppliers" element={<SuppliersScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/library" element={<DocumentLibraryScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
