// components/Navbar.jsx
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <div
      data-theme="synthwave"
      className="navbar bg-base-content shadow-lg sticky top-0 z-50 relative"
    >
      {/* Left: Home + About */}
      <div className="navbar-start gap-2">
        {/* Home button (icon) */}
        <Link href="/" className="btn btn-ghost btn-circle text-base-100 hover:!bg-transparent active:!bg-transparent focus:!bg-transparent" aria-label="Homepage">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l9-7 9 7v8a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8z" />
          </svg>
        </Link>

        {/* About button */}
        <Link href="/about" className="btn btn-ghost btn-sm text-base-100 hover:!bg-transparent active:!bg-transparent focus:!bg-transparent">
          About
        </Link>
      </div>

      {/* Center: AiMe (absolute so it stays visually centered regardless of left/right width) */}
      <div className="navbar-center absolute left-1/2 -translate-x-1/2">
        <span className="inline-block rounded-lg text-base-100 px-3 py-1 text-xl font-bold select-none">
          AI-ME
        </span>
      </div>

      {/* Right: Sign out */}
      <div className="navbar-end">
        <SignOutButton>
          <button className="btn btn-base btn-sm">Sign Out</button>
        </SignOutButton>
      </div>
    </div>
  );
}
