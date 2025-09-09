## Aime

Personalized learning plan generator built with Next.js, Clerk (auth), MongoDB, and OpenAI. Users submit a goal, and the app creates a structured, week-by-week plan that is saved to MongoDB and can be revisited and tracked.

### Project Overview
- **What it does**: Collects a user’s aim, success criteria, start level, target date, and available time. Calls OpenAI to generate a JSON learning plan, normalizes it, and stores it alongside the Clerk user ID. Users can fetch all their plans, get an individual plan, and mark activities complete.
- **Current status**:
  - Auth via Clerk is wired in and enforced with middleware.
  - Plan creation, retrieval, and activity completion updates are implemented.
  - Google Calendar integration utilities exist (OAuth via Clerk + Google APIs) and an endpoint is provided, but the UI wiring and full scheduling logic are not complete yet. Next step: connect plan UI to calendar data and surface availability/scheduling.

## Prerequisites / Setup Requirements
- **Clerk account**: Required for authentication.
- **Google Cloud** (optional, for Google Sign-In/Calendar): Enable OAuth consent screen and Calendar API. Clerk manages OAuth tokens; you must configure Google credentials.
- **MongoDB**: Install a local MongoDB server or use a hosted MongoDB.
- **Environment variables**: Gather all values listed in `.env.local.sample`.
  - Typical values (based on the code):
    - `MONGODB_URI`
    - `OPENAI_API_KEY`
    - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
    - `CLERK_SECRET_KEY`
    - `CLERK_SIGN_IN_URL` (optional; for custom routes)
    - `CLERK_SIGN_UP_URL` (optional; for custom routes)
    - `GOOGLE_OAUTH_CLIENT_ID`
    - `GOOGLE_OAUTH_CLIENT_SECRET`
    - `GOOGLE_OAUTH_REDIRECT_URL`
- **Copy env file**: Duplicate `.env.local.sample` to `.env.local` and fill in your credentials.

## Installation & Local Development
1. Clone the repository
   ```bash
   git clone <your-repo-url>
   cd aime
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Set environment variables
   ```bash
   cp .env.local.sample .env.local
   # then edit .env.local with your values
   ```
4. Start MongoDB locally (if using local MongoDB)
   ```bash
   # macOS (Homebrew example)
   brew services start mongodb-community
   ```
5. Run the development server
   ```bash
   npm run dev
   ```
   App runs by default on `http://localhost:3000`.

## Running Tests
- Run the full test suite:
  ```bash
  npm test
  ```
- The project uses Jest and Testing Library for unit/integration tests, plus Supertest for API route tests. To view coverage locally:
  ```bash
  npx jest --coverage
  ```

## Building for Production
- Build the app:
  ```bash
  npm run build
  ```
- Run the production server:
  ```bash
  npm start
  ```
- Deployment notes:
  - Ensure all environment variables are configured in your hosting platform (e.g., Vercel). All API routes are protected by Clerk middleware unless explicitly marked public. Set your Clerk frontend/backends keys and allowed origins.
  - Provide `MONGODB_URI` reachable from the deployment environment.
  - If using Google Calendar, ensure OAuth consent screen is in the correct published state and redirect URL matches deployment domain.

## API Documentation
All API routes are under Next.js Pages Router and, by default, require authentication via Clerk middleware.

### POST `/api/getplan`
- **Purpose**: Generates a learning plan via OpenAI, normalizes it, and saves it to MongoDB.
- **Auth**: Required (middleware) + uses Clerk `getAuth` to associate the plan with the user.
- **Request (JSON)**:
  ```json
  {
    "aim": "Learn Angular",
    "success": "Build a small app",
    "startingLevel": "Beginner",
    "targetDate": "2025-12-31",
    "timePerDay": 45
  }
  ```
- **Response (200)**:
  ```json
  { "id": "<insertedId>" }
  ```

### GET `/api/getresult`
- **Purpose**: Fetches a single plan document by `id`.
- **Auth**: Required (middleware).
- **Query**: `?id=<planId>`
- **Response (200)**: Returns the full plan document as stored in MongoDB.

### GET `/api/getallplans`
- **Purpose**: Lists all plans for the authenticated user, most recent first.
- **Auth**: Required (middleware + `getAuth`).
- **Response (200)**:
  ```json
  { "plans": [ { "_id": "...", "plan": { ... }, "userId": "..." } ] }
  ```

### PATCH `/api/activitystatus`
- **Purpose**: Marks a specific activity within a plan week as complete/incomplete.
- **Auth**: Required (middleware + `getAuth`).
- **Request (JSON)**:
  ```json
  {
    "planId": "<planId>",
    "checkboxId": "<weekNumber>-<activityIndex>",
    "isChecked": true
  }
  ```
- **Response (200)**: `{ "success": true }` if the activity was updated.

### POST `/api/goals`
- **Purpose**: Alternate plan generator endpoint that returns a generated plan string; echoes input if no OpenAI key is present.
- **Auth**: Required (middleware).
- **Request (JSON)**:
  ```json
  {
    "aime": "Learn guitar",
    "success": "Play 3 songs",
    "startLevel": "Beginner",
    "targetDate": "2025-08-30",
    "timePerDay": 30
  }
  ```
- **Response (200)**: `{ id: string, plan: string }` (or `plan: null` with `echo` payload when OpenAI is disabled).

### POST `/api/saveprogress`
- **Purpose**: Placeholder endpoint to persist progress. Currently logs payload and returns `{ ok: true }`.
- **Auth**: Required (middleware). Uses `getAuth` but persistence logic is pending.

### GET `/api/google/google`
- **Purpose**: Returns Google Calendar events for a user between `start` and `end`.
- **Auth**: Required (middleware). Uses Clerk to retrieve the OAuth access token.
- **Query**: `?clerkUserId=<id>&start=2025-01-01T00:00:00.000Z&end=2025-01-07T00:00:00.000Z`
- **Response (200)**:
  ```json
  {
    "events": [
      { "start": "2025-01-01T09:00:00.000Z", "end": "2025-01-01T10:00:00.000Z", "summary": "...", "description": "..." }
    ]
  }
  ```

### Utility endpoints
- `POST /api/dbtest`: Inserts a fake plan (for local testing). Auth enforced by middleware.
- `GET /api/hello`: Test endpoint.

## Helper Functions
- **`lib/normalizer.js`**: Transforms various OpenAI JSON formats into a consistent internal shape. It:
  - Locates week arrays under multiple possible keys or nested structures.
  - Coerces `objectives`, `activities`, and `tips` to arrays.
  - Wraps each activity as `{ activity: string, completed: false }`.
  - Produces `weeks` as an array of `{ weekNumber, objectives, activities, tips }`.
- **`lib/calculateWeeks.js`**: Computes number of weeks from today to a target date (minimum 1; defaults to 8 if date invalid).

## Architecture & Data Flow
- **Framework**: Next.js (Pages Router).
- **Auth**: Clerk. `middleware.js` protects all routes except those declared public. API routes use `getAuth` to access `userId`.
- **Data storage**: MongoDB via a shared client (`lib/mongodb.js`). Plans stored under `db: aime`, collection `plans`.
- **AI integration**: OpenAI Chat Completions API to generate raw plan JSON which is parsed and normalized before persisting.
- **Calendar integration**: Google APIs with OAuth token retrieval via Clerk. The server fetches events for a user’s primary calendar within a date range.
- **Flow**:
  1. User submits form → POST `/api/getplan`.
  2. Server calls OpenAI → normalize → persist with `userId` → return `planId`.
  3. Client fetches plan(s) via `/api/getresult` or `/api/getallplans`.
  4. Client updates activity completion via `/api/activitystatus`.
  5. Calendar availability can be fetched via `/api/google/google` (UI wiring pending).

## Next Steps / Roadmap
- **Wire in calendar integration**: Connect UI to `/api/google/google` and surface availability, with potential scheduling recommendations.
- **Persist progress**: Implement storage in `/api/saveprogress` and unify with activity status updates.
- **Validation & error handling**: Expand request validation and user feedback.
- **Rate limiting**: Protect generation endpoints from abuse.
- **Schema & migrations**: Formalize plan document schema and add indexes.
- **UI/UX**: Enhance plan visualization and progress tracking.

