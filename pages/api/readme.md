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

---

## Catchall Route for Login

This project uses a **catchall route** for the login page:  
`/pages/login/[[...index]].jsx`

This is important for authentication providers like Clerk.  
A catchall route allows the login page to handle all possible login-related URLs, including OAuth callbacks and multi-step flows.  
**Beginner tip:** You don’t need to change anything—just know that this setup makes login work smoothly with Clerk.

---

## Pages Router vs. App Router

This project uses the **Pages Router** (`pages/` directory) from Next.js, not the newer **App Router** (`app/` directory).

- **Pages Router:**  
  - You create files in the `pages/` folder for each route (like `/login.js` for `/login`).
  - Data fetching methods like `getServerSideProps` and API routes in `pages/api` are available.
  - Easier for beginners and widely used in tutorials.

- **App Router:**  
  - Uses the `app/` directory and introduces new features like React Server Components.
  - Not used in this project.

**Beginner tip:**  
If you see code in the `pages/` folder, you’re using the Pages Router.  
Stick with this unless you want to learn more advanced Next.js features.

---

## Note for Bootcamp Projects

This project is intended for learning and demonstration purposes, not for production use.  
Security warnings and vulnerabilities are less critical in this context, and the Next.js API setup is ideal for rapid
development and prototyping