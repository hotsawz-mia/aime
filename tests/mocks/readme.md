# Test Mocks – Comprehensive Guide

This folder contains mocks for all external dependencies in your project. Using these mocks in your Jest tests ensures that your tests are:

- **Fast** – no real network or database calls
- **Reliable** – predictable results every time
- **Isolated** – tests do not interfere with each other
- **Beginner-friendly** – you can understand and modify mocks easily

This guide explains how to use each mock, why it is needed, and provides practical examples.

---

## Table of Contents

1. [Clerk](#clerk)
2. [OpenAI](#openai)
3. [MongoDB / Mongoose](#mongodb--mongoose)
4. [Example Test Using All Mocks](#example-test-using-all-mocks)
5. [General Notes and Best Practices](#general-notes-and-best-practices)
6. [Mocking getPlan and getResult API Endpoints](#mocking-getplan-and-getresult-api-endpoints)

---

## 1. Clerk

**File:** `clerk.js`

### Purpose

Clerk provides authentication and user management. In tests, you **should never use real Clerk hooks** because they rely on real sessions and network calls.  
The mock allows you to simulate logged-in or logged-out users, test protected routes, redirects, and user-dependent UI without network dependency.

### How to Import in Tests

```js
jest.mock('@clerk/nextjs'); // Automatically uses __mocks__/clerk.js

import { useUser, useClerk } from '@clerk/nextjs';
```

### How to Use

Simulate a logged-in user:

```js
useUser.mockReturnValue({
  isSignedIn: true,
  user: { id: 'user_123', email: 'test@example.com' },
});
```

Simulate a logged-out user:

```js
useUser.mockReturnValue({
  isSignedIn: false,
  user: null,
});
```

- `useClerk()` returns a fake `signOut()` function.
- `ClerkProvider` wraps components in tests (just returns children).
- `withAuth(Component)` returns the component directly for testing protected routes without real auth.

### Notes / Tips

- Always import hooks from `@clerk/nextjs`; the mock overrides them automatically.
- Toggle `isSignedIn` per test to cover authenticated and unauthenticated scenarios.
- This approach ensures your front-end tests do not require real authentication or network calls.

---

## 2. OpenAI

**File:** `openai.js`

### Purpose

OpenAI API calls are external and network-dependent. For tests, you need predictable, fast, isolated behavior.  
The mock allows your components or API routes to call OpenAI methods without hitting the real API.

### How to Import in Tests

```js
jest.mock('openai'); // Uses __mocks__/openai.js

import { OpenAI } from 'openai';
```

### How to Use

Create a mock OpenAI client:

```js
const client = new OpenAI();
```

Calls like `chat.completions.create` return a predictable mocked response:

```js
const response = await client.chat.completions.create({ messages: [] });
console.log(response.choices[0].message.content); // "Mocked response"
```

### Notes / Tips

- You can override the mocked response for specific tests if needed.
- This mock works for both front-end components and backend API route tests.
- Ensures your tests remain fast and deterministic, avoiding API rate limits or network errors.

---

## 3. MongoDB / Mongoose

**File:** `mongo.js`

### Purpose

Your app likely relies on MongoDB for persistence.  
In tests, using the real database can be slow, flaky, or require a dedicated test database.  
The mock simulates database operations like `insertOne` and `findOne` in memory, without hitting a real database.

### How to Import in Tests

```js
jest.mock('../lib/mongo'); // Points to your mongo wrapper

import { connect, getCollection, clearMockData } from '../__mocks__/mongo';
```

### How to Use

- `connect()` simulates a DB connection.
- `getCollection(name)` returns mocked collection functions:
  - `insertOne(doc)` → adds a document to an in-memory mock collection.
  - `findOne(query)` → retrieves a document by `_id`.

```js
const users = getCollection('users');
await users.insertOne({ _id: '123', name: 'Alice' });
const result = await users.findOne({ _id: '123' });
expect(result.name).toBe('Alice');
```

- Reset the mock database between tests to ensure isolation:

```js
beforeEach(() => clearMockData());
```

### Notes / Tips

- Always call `clearMockData()` in `beforeEach()` or `afterEach()` to ensure test isolation.
- You can extend the mock to support other operations like `updateOne` or `deleteOne` if needed.
- This approach avoids network calls, ensures predictable behavior, and keeps tests fast.

---

## 4. Example Test Using All Mocks

```js
// tests/pages/example.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { OpenAI } from 'openai';
import { getCollection, clearMockData } from '../__mocks__/mongo';

jest.mock('@clerk/nextjs');
jest.mock('openai');
jest.mock('next/router', () => ({ useRouter: jest.fn() }));

describe('Example test using all mocks', () => {
  const push = jest.fn();

  beforeEach(() => {
    // Reset DB state to ensure tests are isolated
    clearMockData();

    // Mock Clerk user
    useUser.mockReturnValue({ isSignedIn: true, user: { id: 'user_123' } });

    // Mock Next.js router
    useRouter.mockReturnValue({ push });
  });

  test('renders, submits form, saves to DB, and calls OpenAI', async () => {
    // Render a simple test component (replace with your actual component)
    render(
      <div>
        <button onClick={() => push('/next-page')}>Go</button>
      </div>
    );

    // Test router redirect
    fireEvent.click(screen.getByRole('button', { name: /go/i }));
    expect(push).toHaveBeenCalledWith('/next-page');

    // Test MongoDB mock
    const users = getCollection('users');
    await users.insertOne({ _id: '123', name: 'Alice' });
    const result = await users.findOne({ _id: '123' });
    expect(result.name).toBe('Alice');

    // Test OpenAI mock
    const client = new OpenAI();
    const response = await client.chat.completions.create({ messages: [] });
    expect(response.choices[0].message.content).toBe('Mocked response');
  });
});
```

### Notes for Example Test

- Demonstrates all three mocks working together: Clerk, OpenAI, and Mongo.
- `clearMockData()` ensures the mocked database is reset between tests.
- Router and Clerk are mocked to prevent network calls.
- OpenAI mock is predictable and fast.
- This pattern can be used for both front-end component tests and backend API route tests.

---

## 5. General Notes and Best Practices

- Always mock external services – Clerk, OpenAI, and MongoDB should be mocked to keep tests fast and reliable.
- Use `jest.mock(...)` at the top of your test files to activate the mocks.
- Override mocks per test if you need different behaviors (e.g., logged-out user, different OpenAI response).
- Reset mock state between tests to ensure isolation (especially for MongoDB).
- Do not call real hooks or services – the mocks replace them for predictable testing.
- Use the example test as a template to structure your own tests with multiple dependencies.
- Keep this README as a reference for future tests – it explains why and how each mock works.

---

## ✅ Summary

This comprehensive guide ensures that you can:

- Write front-end tests with mocked authentication and routing.
- Write back-end tests with mocked OpenAI calls and database operations.
- Combine all mocks in one test for full feature coverage.
- Keep tests fast, reliable,

## Mocking getPlan and getResult API Endpoints

Mocking your `getPlan` and `getResult` API endpoints is a good idea if you want to:

- Test your frontend components or pages without hitting the real backend.
- Write integration tests that simulate API responses.
- Ensure your tests are fast, reliable, and isolated from database/network issues.

## Mocking getPlan and getResult API Endpoints

Mocking your `getPlan` and `getResult` API endpoints is a good idea if you want to:

- Test your frontend components or pages without hitting the real backend.
- Write integration tests that simulate API responses.
- Ensure your tests are fast, reliable, and isolated from database/network issues.

### How to Use API Endpoint Mocks in Tests

**Direct Import Style (Recommended for Simplicity):**

Instead of importing the real API route and swapping it with `jest.mock`, you can import the mock handler directly from your mocks directory.  
This makes it clear what is under test and avoids confusion about which implementation is being used.

```js
import getplan from '../mocks/getplan';
import getresult from '../mocks/getresult';
```

When your code calls these handlers in your tests, you are using the mock logic directly.

### Example Test

```js
import getplan from '../mocks/getplan';
import getresult from '../mocks/getresult';

describe('API endpoint mocks (direct import style)', () => {
  test('getplan returns a mocked plan ID', () => {
    const req = { method: 'POST', body: {/* ... */} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    getplan(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 'mocked-plan-id' });
  });

  test('getresult returns a mocked plan document', () => {
    const req = { method: 'GET', query: { id: 'mocked-plan-id' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    getresult(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      plan: expect.any(Object),
      createdAt: expect.any(Date),
      userId: 'mocked-user-id',
    }));
  });
});
```

**Tip:**  
You can customize the mock responses for different test