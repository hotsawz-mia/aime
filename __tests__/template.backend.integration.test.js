// __tests__/template.backend.integration.test.js
/** @jest-environment node */

/**
 * Template: Backend INTEGRATION(-ish) test for a Next.js API route
 *
 * Goal: Minimal, copy-pastable example that runs the API handler behind a tiny
 * Node http server (no full Next dev server). This gives you "real" HTTP I/O
 * via supertest without pulling in Next's rendering stack or config.
 *
 * 🔧 How to adapt:
 *  1) Change API_PATH to point at the route you want to test.
 *  2) Adjust the example POST body to match your API contract.
 *  3) Add more `test(...)` blocks as needed (e.g., auth required, bad payload, etc).
 *
 * 🧪 Why not spin up `next dev`?
 *    It’s heavier, slower, and requires Next config + build output files.
 *    This template isolates the route logic only.
 */

// ------- 1) Polyfills (keep these at the top) -------------------------------
// Some transitive deps expect TextEncoder/TextDecoder in Node test envs.
const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = global.TextEncoder || TextEncoder;
global.TextDecoder = global.TextDecoder || TextDecoder;

// If you ever see crypto-related errors, uncomment:
// const { webcrypto } = require("crypto");
// global.crypto = global.crypto || webcrypto;

// ------- 2) Imports ---------------------------------------------------------
const http = require("http");
const request = require("supertest");

// ✅ CHANGE THIS to your route under test
const API_PATH = "../pages/api/goals/index.js";

// ------- 3) Tiny Next-like adapter -----------------------------------------
/**
 * Next adds `res.status(code).json(obj)` and parses JSON bodies for you.
 * Our mini-adapter patches the Node `res` and parses JSON only for POSTs.
 */
function augmentRes(res) {
  res.status = function (code) {
    res.statusCode = code;
    return res;
  };
  res.json = function (obj) {
    if (!res.getHeader("content-type")) {
      res.setHeader("content-type", "application/json");
    }
    res.end(JSON.stringify(obj));
  };
  return res;
}

function readJsonBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : undefined);
      } catch {
        resolve(undefined);
      }
    });
  });
}

/** Load a fresh copy of the API route (works with ESM/CJS default exports) */
async function loadHandler() {
  const mod = await import(`${API_PATH}?x=${Date.now()}`);
  const maybe = mod?.default ?? mod;
  const handler = typeof maybe === "function" ? maybe : maybe?.default;
  if (typeof handler !== "function") throw new Error("API handler not found");
  return handler;
}

/** Start a tiny HTTP server that forwards requests to the API handler */
async function startApiServer(handler) {
  const server = http.createServer(async (req, res) => {
    if (
      req.method === "POST" &&
      (req.headers["content-type"] || "").includes("application/json")
    ) {
      req.body = await readJsonBody(req);
    }
    augmentRes(res);
    handler(req, res);
  });
  await new Promise((r) => server.listen(0, r)); // 0 = pick a random free port
  return server;
}

// ------- 4) Test lifecycle --------------------------------------------------
let server;

beforeAll(async () => {
  // For this template we cover the "no key" branch in the example route
  delete process.env.OPENAI_API_KEY;

  const handler = await loadHandler();
  server = await startApiServer(handler);
});

afterAll(async () => {
  if (server) await new Promise((r) => server.close(r));
});

// Give a little extra time on CI
jest.setTimeout(15000);

// ------- 5) Example tests (copy & expand) -----------------------------------
test("POST /api/goals returns 200 echo when no OPENAI key (integration-ish)", async () => {
  const agent = request(server);
  const res = await agent
    .post("/api/goals")
    .set("Content-Type", "application/json")
    .send({
      // ✅ Adjust fields to your route contract
      aime: "TEST_GOAL",
      success: "TEST_SUCCESS",
      startLevel: "TEST_START",
      targetDate: "2030-01-01",
      timePerDay: "15",
    });

  expect(res.status).toBe(200);
  expect(res.body).toMatchObject({
    plan: null,
    echo: {
      aime: "TEST_GOAL",
      success: "TEST_SUCCESS",
      startLevel: "TEST_START",
      targetDate: "2030-01-01",
      timePerDay: "15",
    },
  });
  expect(res.body.id).toBeDefined();
});

test("GET /api/goals returns 405 (integration-ish)", async () => {
  const agent = request(server);
  const res = await agent.get("/api/goals");
  expect(res.status).toBe(405);
});

// 💡 More ideas:
// - 400 when content-type is missing or wrong
// - 400 when required fields are missing
// - 500 surfaced errors (e.g., mock throw inside handler)
// - When OPENAI_API_KEY is set, mock OpenAI and assert shape of returned plan