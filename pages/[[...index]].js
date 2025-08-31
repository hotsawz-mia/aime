import React from "react";
import { SignedIn, SignedOut, SignInButton, SignOutButton, SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (<div>
    <h2>Homepage - Welcome to Ai-me</h2>
      <SignedIn>
        <Link href="/form">Make a plan</Link>
        <SignOutButton/>
      </SignedIn>
      <SignedOut>
        <SignInButton>Sign In</SignInButton>
        <Link href="/register">Sign Up</Link>
      </SignedOut>
    </div>
  )
}
