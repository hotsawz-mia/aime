import { ClerkProvider } from '@clerk/nextjs'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider>
     <Component {...pageProps} />
    </ClerkProvider>
  )
}

export default MyApp

// import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs'


// function MyApp({ Component, pageProps }) {
//   return (
//     <ClerkProvider>
//       <SignedIn>
//         <Component {...pageProps} />
//       </SignedIn>
//       <SignedOut>
//            <RedirectToSignIn fallbackRedirectUrl="/login" />
//       </SignedOut>
//     </ClerkProvider>
//   )
// }

// export default MyApp