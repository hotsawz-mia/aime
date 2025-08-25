# API Directory

This folder contains all server-side API routes handled by Next.js.  
Here you can define endpoints for:

- Login
- Logout
- Signup
- Google API routes
- OpenAI API routes
- Database routes
- etc.

## Why use this setup?

Using the `pages/api` directory is different from using Express in these ways:

- **No separate backend server:** With Express, you need to set up and manage a separate server. With Next.js API routes, everything is part of your Next.js app.
- **Automatic serverless functions:** Each file in `pages/api` becomes a serverless function, which runs only when needed and scales automatically.
- **Unified deployment:** You deploy your frontend and backend together, making hosting and updates simpler.
- **Built-in integration:** API routes have easy access to environment variables, authentication, and other Next.js features.

## Server vs. Serverless Functions

- **Server functions:**  
  Run on a server that is always on and managed by you. You must handle scaling, updates, and maintenance. Example: Express server.

- **Serverless functions:**  
  Run only when a request comes in. You don’t manage the server—your hosting provider does. Each function handles one request, then shuts down. This makes scaling and maintenance much easier.

## Advantages over Express

- **Less setup:** No need to configure or maintain a separate backend server.
- **Simpler scaling:** Serverless functions scale automatically with demand.
- **Lower maintenance:** Hosting providers manage the infrastructure for you.
- **Faster development:** You can build and deploy both frontend and backend together.

## Local Development Notes

- You can run both your frontend and backend API routes locally with a single command (`npm run dev`).
- No need to start a separate Express server—Next.js handles API routes for you.
- Serverless functions behave like regular server endpoints during local development, making it easy to build and test the app.