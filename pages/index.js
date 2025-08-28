import { SignedOut, SignedIn, SignOutButton, SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <SignedOut>
        <h1>Welcome! Please sign in.</h1>
        {/* Optionally link to /login */}
        <SignInButton>Sign in</SignInButton>
      </SignedOut>
      <SignedIn>
        <h1>Welcome to the homepage!</h1>
        <SignOutButton fallbackRedirectUrl="/login">Sign out</SignOutButton>
      </SignedIn>
    </div>
  );
}