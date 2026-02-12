import { SignIn, useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export function SignInPage() {
  const { isLoaded, isSignedIn } = useAuth();

  if (isLoaded && isSignedIn) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="screen">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/app"
      />
    </div>
  );
}
