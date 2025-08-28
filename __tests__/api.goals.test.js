const { createRequest, createResponse } = require("node-mocks-http");

async function loadHandler() {
  const mod = await import("../pages/api/goals/index.js?x=" + Date.now());
  const maybe = mod?.default ?? mod;
  const handler = typeof maybe === "function" ? maybe : maybe?.default;
  if (typeof handler !== "function") {
    throw new Error("API handler not found; got: " + JSON.stringify(Object.keys(mod || {})));
  }
  return handler;
}

// helper to make a JSON POST
function jsonReq(body, headers = {}) {
  return createRequest({
    method: "POST",
    url: "/api/goals",
    headers: { "content-type": "application/json", ...headers },
    body,
  });
}

test("405 on non-POST", async () => {
  const handler = await loadHandler();
  const req = createRequest({ method: "GET", url: "/api/goals" });
  const res = createResponse();
  await handler(req, res);
  expect(res._getStatusCode()).toBe(405);
});

test("400 when content-type not application/json", async () => {
  const handler = await loadHandler();
  const req = createRequest({ method: "POST", url: "/api/goals" }); // no header
  const res = createResponse();
  await handler(req, res);
  expect(res._getStatusCode()).toBe(400);
  expect(res._getJSONData().error).toMatch(/application\/json/i);
});

test("400 when required fields missing", async () => {
  const handler = await loadHandler();
  const req = jsonReq({ aime: "x" }); // missing others
  const res = createResponse();
  await handler(req, res);
  expect(res._getStatusCode()).toBe(400);
});

test("200 echo when OPENAI_API_KEY is absent", async () => {
  delete process.env.OPENAI_API_KEY; // ensure echo path
  const handler = await loadHandler();

  const body = {
    aime: "TEST_GOAL",
    success: "TEST_SUCCESS",
    startLevel: "TEST_START",
    targetDate: "2030-01-01",
    timePerDay: "15",
  };
  const req = jsonReq(body);
  const res = createResponse();

  await handler(req, res);

  expect(res._getStatusCode()).toBe(200);
  const json = res._getJSONData();
  expect(json.plan).toBeNull();
  expect(json.echo).toMatchObject(body);
  expect(json.id).toBeDefined();
});