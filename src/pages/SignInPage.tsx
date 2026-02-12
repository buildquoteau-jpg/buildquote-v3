import { SignIn } from "@clerk/clerk-react";

export function SignInPage() {
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
