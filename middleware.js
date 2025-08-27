// can add protected routes here as well

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// use the format below to create routes that are public and don't require authentication
// currently this is set up so that users will be redirected to login sugn-up if they are not registered
const isPublicRoute = createRouteMatcher([
    "/",
    "/login(.*)",
    "/register(.*)",
//     "/book(.*)",
])

export default clerkMiddleware(async (auth, req) =>{
    if (!isPublicRoute(req)) {
        await auth.protect()        
    }
});

// export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};