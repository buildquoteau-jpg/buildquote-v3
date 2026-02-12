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
            colorNeutral: "#D7DEE6",
            colorDanger: "#A94442",
          },
          elements: {
            rootBox: "clerk-root-box",
            cardBox: "clerk-card-box",
            card: "bg-card clerk-card",
            formButtonPrimary: "bg-btn bg-btn--primary clerk-btn",
            formFieldInput: "bg-input clerk-input",
            formFieldLabel: "clerk-label",
            footerActionLink: "clerk-footer-link",
            socialButtonsBlockButton: "bg-btn bg-btn--secondary clerk-btn",
            identityPreviewText: "clerk-identity-text",
            userButtonPopoverCard: "bg-card clerk-popover-card",
            userButtonPopoverActionButton: "bg-btn bg-btn--secondary clerk-popover-action",
            userButtonPopoverActionButtonText: "clerk-popover-action-text",
          },
        }}
      >
        {appWithConvex}
      </ClerkProvider>
    ) : (
      <div className="screen">
        <p className="hint">
          Missing Clerk publishable key. Set VITE_CLERK_PUBLISHABLE_KEY to run
          authenticated routes.
        </p>
      </div>
    )}
  </StrictMode>
);
