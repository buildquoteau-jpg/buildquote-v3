import { SignUp, useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export function SignUpPage() {
  const { isLoaded, isSignedIn } = useAuth();

  if (isLoaded && isSignedIn) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="screen">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/app"
      />
    </div>
  );
}
