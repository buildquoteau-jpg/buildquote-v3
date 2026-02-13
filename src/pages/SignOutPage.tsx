import { useClerk } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export function SignOutPage() {
  const { signOut } = useClerk();

  useEffect(() => {
    // Sign out then bounce to landing page
    signOut({ redirectUrl: "/" });
  }, [signOut]);

  // Fallback UI while effect runs
  return <Navigate to="/" replace />;
}
