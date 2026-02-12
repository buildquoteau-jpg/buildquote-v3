import { SignUp } from "@clerk/clerk-react";

export function SignUpPage() {
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
