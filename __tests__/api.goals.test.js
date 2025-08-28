const { createRequest, createResponse } = require("node-mocks-http");

function loadHandler() {
    const path = require.resolve("../pages/api/goals/index.js");
    delete require.cache[path];
    return require("../pages/api/goals/index.js");
}

function jsonReq(body, method = "POST", headers = {}) {
  return createRequest({
    method,
    url: "/api/goals",
    headers: { "content-type": "application/json", ...headers },
    body,
  });
}

test("405 on non-POST", async () => {
    const handler = loadHandler();
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
  const req = jsonReq({ aime: "x" }); // missing success + targetDate
  const res = createResponse();
  await handler(req, res);
  expect(res._getStatusCode()).toBe(400);
  expect(res._getJSONData().error).toMatch(/aime, success, targetDate/);
});

test("200 echo when OPENAI_API_KEY is absent", async () => {
  delete process.env.OPENAI_API_KEY;
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
  expect(json.note).toMatch(/OpenAI disabled/i);
});

test("200 plan when OPENAI_API_KEY is set (OpenAI mocked)", async () => {
  // Set a fake key
  process.env.OPENAI_API_KEY = "sk-test";

  // Mock the OpenAI module shape used by the handler
  jest.unstable_mockModule("openai", () => ({
    default: class OpenAI {
      chat = {
        completions: {
          create: async () => ({
            choices: [{ message: { content: "PLAN_TEXT" } }],
          }),
        },
      };
      constructor() {}
    },
  }));

  const handler = await loadHandler();

  const req = jsonReq({
    aime: "A",
    success: "B",
    startLevel: "C",
    targetDate: "2030-01-01",
    timePerDay: "10",
  });
  const res = createResponse();

  await handler(req, res);

  expect(res._getStatusCode()).toBe(200);
  const json = res._getJSONData();
  expect(json.plan).toBe("PLAN_TEXT");
  expect(json.id).toBeDefined();
});