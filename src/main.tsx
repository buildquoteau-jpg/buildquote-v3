import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./index.css";
import App from "./App.tsx";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as
  | string
  | undefined;
const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
const convexClient = convexUrl ? new ConvexReactClient(convexUrl) : null;

const app = <App />;
const appWithConvex = convexClient ? (
  <ConvexProvider client={convexClient}>{app}</ConvexProvider>
) : (
  app
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {clerkPubKey ? (
      <ClerkProvider
        publishableKey={clerkPubKey}
        appearance={{
          variables: {
            fontFamily: "var(--bq-font)",
            colorPrimary: "#2F3E4F",
            colorBackground: "#FFFFFF",
            colorText: "#1F2A33",
            colorInputBackground: "#FFFFFF",
            colorInputText: "#1F2A33",
            borderRadius: "14px",
          },
          elements: {
            card: "clerk-card",
            formButtonPrimary: "bq-btn bq-btn--primary clerk-btn",
            formFieldInput: "bq-input clerk-input",
            footerActionLink: "clerk-footer-link",
            socialButtonsBlockButton: "bq-btn bq-btn--secondary clerk-btn",
          },
        }}
      >
        {appWithConvex}
      </ClerkProvider>
    ) : (
      <>
        {appWithConvex}
        {/* Clerk not configured — sign-in screens will show placeholder */}
      </>
    )}
  </StrictMode>
);
