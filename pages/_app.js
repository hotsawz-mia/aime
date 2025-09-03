// pages/_app.js
import { ClerkProvider } from '@clerk/nextjs'
import '../styles/globals.css'
import { useRouter } from "next/router";
import Navbar from "../components/Navbar"

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const path = router.asPath.split("?")[0]; // strip querystring

  // Hide on Clerk auth routes + login
  const HIDE_ON = ['/sign-in', '/sign-up', '/sign-out', '/login'];
  const isAuthPage =
    HIDE_ON.some(p => router.pathname.startsWith(p) || router.asPath.startsWith(p));

  // Show only on homepage (/), form, and [planid]
  const isHome = path === '/'; // because homepage is pages/[[...index]].js
  const shouldShowNavbar =
    isHome ||
    router.pathname === '/form' ||
    router.pathname === '/[planid]';

  return (
    <ClerkProvider>
      <div data-theme="nord">
        {!isAuthPage && shouldShowNavbar && <Navbar />}
        <Component {...pageProps} />
      </div>
    </ClerkProvider>
  )
}

export default MyApp

