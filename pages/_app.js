// pages/_app.js
import { ClerkProvider } from '@clerk/nextjs'
import '../styles/globals.css'
import { useRouter } from "next/router";
import Navbar from "../components/Navbar"

function MyApp({ Component, pageProps }) {
  // const router = useRouter();
  // const path = (router.asPath || '').split('?') [0];
  // const segs = path.split('/').filter(Boolean); // e.g. '/', '/form', '/plan/<id>'

  // // Hide on Clerk auth routes + login
  // const HIDE_ON = ['/sign-in', '/sign-up', '/sign-out', '/login'];
  // const isAuthPage = HIDE_ON.some(p => path.startsWith(p));

  // // Decides where to show the navbar:
  // const isHome = segs.length === 0;
  // const isForm = segs.length === 1 && segs[0] === "form";
  // // The plan IDs are Mongo ObjectId strings:
  // const isPlan = 
  //   segs.length === 2 &&
  //   segs[0] === 'plan' &&
  //   /^[0-9a-fA-F]{24}$/.test(segs[1]); // Mongo ObjectId
  // const shouldShowNavbar = !isAuthPage && (isHome || isForm || isPlan);

  return (
    <ClerkProvider>
      <div data-theme="synthwave">
        <Navbar />
        <Component {...pageProps} />
      </div>
    </ClerkProvider>
  )
}

export default MyApp