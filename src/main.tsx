import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./index.css";
import App from "./App.tsx";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as
  | string
  | undefined;

const app = <App />;

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
