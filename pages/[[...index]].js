import React from "react";
import { SignedIn, SignedOut, SignInButton, useUser, SignOutButton, SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";
//
// import { getAuth } from "@clerk/nextjs/server";
// import clientPromise from "/lib/mongodb";
//

// export default function Home() {
//   return (<div>
//     <h2>Homepage - Welcome to Ai-me</h2>
//       <SignedIn>
//         <Link href="/form">Make a plan</Link>
//         <SignOutButton/>
//       </SignedIn>
//       <SignedOut>
//         <SignInButton>Sign In</SignInButton>
//         <Link href="/register">Sign Up</Link>
//       </SignedOut>
//     </div>
//   )
// }

export default function Home() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isSignedIn } = useUser();
  useEffect(() => {
    if (isSignedIn && user) {
      fetchPlans();
    } else {
      setLoading(false);
    }
  }, [isSignedIn, user]);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/getallplans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans || []);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };
  
  console.log(plans);
  return (
    <div data-theme="synthwave" className="min-h-screen bg-base-200">
      {/* Hero / Welcome */}
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
          {/* Plans section */}
          <div className="mb-6">
            {plans.length === 0 ? (
              <div className="mb-4">
                <p className="text-sm opacity-80">No plans yet.</p>
              </div>
            ) : (
              <h2 className="text-xl font-semibold mb-3">Your plans</h2>
            )}

            {plans.length > 0 && (
              <ul className="menu bg-base-100 rounded-box shadow w-full">
                {plans.map((p) => (
                  <li key={p._id}>
                    <div className="flex items-center justify-between gap-3">
                      <Link href={`/plan/${p._id}`} className="flex-1 min-w-0 truncate">
                        {p.plan.learning_plan.aim || "Untitled plan"}
                      </Link>
                      <div className="flex items-center gap-2 shrink-0">
                        {p.plan.learning_plan.targetDate && (
                          <span className="badge badge-secondary">
                            {new Date(p.plan.learning_plan.targetDate).toLocaleDateString()}
                          </span>
                        )}
                        {/* <-- makes Open a link */}
                        <Link href={`/plan/${p._id}`} className="btn btn-sm btn-outline">
                          Open
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Make a plan link */}
          <div className="flex justify-center">
            <Link href="/form" className="btn btn-primary">
              Make a plan
            </Link>
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
                  <button className="btn btn-primary">Sign in</button>
                </SignInButton>
                <Link href="/register" className="btn btn-secondary">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}

// ---- Server-side: fetch the user's plans by userId ----
// export async function getServerSideProps(ctx) {
//   const { userId } = getAuth(ctx.req) || {};

//   // If not signed in, let <SignedOut> handle UI
//   if (!userId) {
//     return { props: { plans: [] } };
//   }

//   const client = await clientPromise;
//   const db = client.db("aime");                 // matches API route
//   const collection = db.collection("plans");    // matches API route

//   // Supports userId or user_id fields
//   const raw = await collection
//     .find({ $or: [{ userId }, { user_id: userId }] })
//     .project({ plan: 1, createdAt: 1 })
//     .sort({ createdAt: -1 })
//     .toArray();

//   const plans = raw.map((doc) => {
//     const planObj =
//       typeof doc.plan === "string" ? safeParse(doc.plan) : (doc.plan || {});
//     const lp = planObj?.learning_plan || planObj?.learningPlan || planObj || {};
//     return {
//       id: doc._id?.toString(),                   // uses ObjectId string for links
//       aim: lp.aim || "Untitled plan",
//       targetDate: lp.targetDate || null,
//       createdAt: doc.createdAt
//         ? new Date(doc.createdAt).toISOString()
//         : null,
//     };
//   });

//   return { props: { plans } };
// }

// function safeParse(s) {
//   try { return JSON.parse(s); } catch { return null; }
// }