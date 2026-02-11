import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import "./index.css";
import App from "./App.tsx";

// TODO: wrap with ConvexProvider once Convex is authenticated
// import { ConvexProvider, ConvexReactClient } from "convex/react";
// const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as
  | string
  | undefined;

const app = <App />;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {clerkPubKey ? (
      <ClerkProvider publishableKey={clerkPubKey}>{app}</ClerkProvider>
    ) : (
      <>
        {app}
        {/* Clerk not configured — sign-in screens will show placeholder */}
      </>
    )}
  </StrictMode>
);
