import { ClerkProvider } from '@clerk/nextjs'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider>
      <div data-theme="nord">
        <Component {...pageProps} />
      </div>
    </ClerkProvider>
  )
}

export default MyApp
