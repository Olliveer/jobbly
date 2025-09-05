import {
  SignInButton as ClerkSignInButton,
  SignOutButton as ClerkSignOutButton,
  SignUpButton as ClerkSignUpButton,
} from "@clerk/nextjs";
import { Suspense, ComponentProps } from "react";
import { Button } from "@/components/ui/button";

export function SignOutButton({
  children = <Button>Sign Out</Button>,
  ...props
}: ComponentProps<typeof ClerkSignOutButton>) {
  return (
    <Suspense>
      <ClerkSignOutButton {...props}>{children}</ClerkSignOutButton>
    </Suspense>
  );
}

export function SignUpButton({
  children = <Button>Sign Up</Button>,
  ...props
}: ComponentProps<typeof ClerkSignUpButton>) {
  return (
    <Suspense>
      <ClerkSignUpButton {...props}>{children}</ClerkSignUpButton>
    </Suspense>
  );
}

export function SignInButton({
  children = <Button>Sign In</Button>,
  ...props
}: ComponentProps<typeof ClerkSignInButton>) {
  return (
    <Suspense>
      <ClerkSignInButton {...props}>{children}</ClerkSignInButton>
    </Suspense>
  );
}
