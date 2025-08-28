// __tests__/template.backend.integration.test.js
/** @jest-environment node */

/**
 * Simplified template for backend integration(-ish) testing of a Next.js API route.
 *
 * HOW TO USE:
 *  1. Change API_PATH to point to your API handler file.
 *  2. Adjust the example request(s) and assertions to match your API contract.
 *  3. Add more tests as needed.
 *
 * This template spins up a minimal Node HTTP server with your API handler,
 * allowing you to test it with supertest (real HTTP I/O).
 */

const http = require("http");
// Polyfill for Node test env (needed by supertest -> superagent -> formidable -> cuid2)
const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = global.TextEncoder || TextEncoder;
global.TextDecoder = global.TextDecoder || TextDecoder;
const request = require("supertest");

// Path to your API route (adjust this!)
const API_PATH = "../pages/api/goals/index.js";

// --- Minimal Next.js API route adapter ---
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

async function loadHandler() {
  const mod = await import(`${API_PATH}?x=${Date.now()}`);
  const handler = mod?.default?.default ?? mod?.default ?? mod;
  if (typeof handler !== "function") throw new Error("API handler not found");
  return handler;
}

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
  await new Promise((resolve) => server.listen(0, resolve));
  return server;
}

// --- Jest test setup/teardown ---
let server;

beforeAll(async () => {
  const handler = await loadHandler();
  server = await startApiServer(handler);
});

afterAll(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
});

// --- Example test(s) ---
test("POST /api/goals returns 200 and echoes input", async () => {
  const agent = request(server);
  const res = await agent
    .post("/api/goals")
    .set("Content-Type", "application/json")
    .send({
      aime: "TEST_GOAL",
      success: "TEST_SUCCESS",
      startLevel: "TEST_START",
      targetDate: "2030-01-01",
      timePerDay: "15",
    });

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("echo");
  expect(res.body.echo).toMatchObject({
    aime: "TEST_GOAL",
    success: "TEST_SUCCESS",
    startLevel: "TEST_START",
    targetDate: "2030-01-01",
    timePerDay: "15",
  });
});

test("GET /api/goals returns 405", async () => {
  const agent = request(server);
  const res = await agent.get("/api/goals");
  expect(res.status).toBe(405);
});

// Add more tests as needed!