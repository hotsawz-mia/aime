import React from "react";
import { SignedIn, SignedOut, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Home({ plans = [] }) {
  return (
    <div data-theme="synthwave" className="min-h-screen bg-base-200">
      <section className="hero">
        <div className="hero-content text-center py-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Welcome to <span className="text-success">Ai-Me</span>
            </h1>
            <p className="mt-3 opacity-80">
              Your AI-assisted aims, all in one place.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16 max-w-3xl">
        <SignedIn>
          <div className="mb-6">
            {plans.length === 0 ? (
              <div className="mb-4">
                <p className="text-sm opacity-80">No plans yet.</p>
              </div>
            ) : (
              <h2 className="text-xl font-semibold mb-3">Your plans</h2>
            )}
          </div>

          <div className="flex justify-center">
            <Link href="/form" className="btn btn-primary" data-testid="make-plan-link">
              Make a plan
            </Link>
          </div>

          <div className="flex justify-end">
            <SignOutButton>
              <button className="btn btn-error" data-testid="sign-out-button">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </SignedIn>

        <SignedOut>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Welcome!</h2>
              <p className="opacity-80">
                Sign in to view your plans or create a new one.
              </p>
              <div className="card-actions mt-4">
                <SignInButton>
                  <button className="btn btn-primary" data-testid="sign-in-button">
                    Sign in
                  </button>
                </SignInButton>
                <button className="btn btn-secondary" data-testid="sign-up-link">
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}