import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import "./styles/tokens.css";
import "./styles/components.css";
import "./index.css";
import App from "./App.tsx";
import { clerkAppearance } from "./lib/clerkTheme";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as
  | string
  | undefined;

const app = <App />;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {clerkPubKey ? (
      <ClerkProvider publishableKey={clerkPubKey} appearance={clerkAppearance}>
        {app}
      </ClerkProvider>
    ) : (
      <>
        {app}
        {/* Clerk not configured — sign-in screens will show placeholder */}
      </>
    )}
  </StrictMode>
);
