// components/Navbar.jsx
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <div data-theme="synthwave" className="navbar bg-base-content shadow-lg sticky top-0 z-50">
      {/* Left: dropdown */}
      <div className="navbar-start">
        <div className="dropdown">
          <button
            tabIndex={0}
            className="btn btn-circle"
            aria-label="Open menu"
          >
            {/* hamburger */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h10" />
            </svg>
          </button>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href="/">Homepage</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Center: title (not a button) */}
      <div className="navbar-center">
        <span className="inline-block rounded-lg bg-success text-base-100 px-3 py-1 text-xl font-bold select-none">AiMe</span>
      </div>

      {/* Right: home icon + sign out */}
      <div className="navbar-end gap-2">
        <Link href="/" className="btn btn-circle" aria-label="Go to homepage">
          {/* home icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l9-7 9 7v8a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8z" />
          </svg>
        </Link>

        <SignOutButton>
          <button className="btn btn-error content btn-sm">
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
