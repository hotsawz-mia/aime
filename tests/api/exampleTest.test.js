/**
 * API tests using direct mock imports.
 *
 * Why direct imports?
 * - We keep all mocks in `/tests/mocks`.
 * - Instead of importing the *real* API route and swapping it with `jest.mock`,
 *   we import the mock directly so it’s obvious what’s under test.
 * - This avoids confusion: there’s no "pretend real import" that’s secretly replaced.
 *
 * If later we need to test the real API handler against a test database,
 * we’ll write a separate suite (e.g., `api.integration.test.js`).
 */

// ignore the linting issue
import getplan from '../mocks/getplan';
import getresult from '../mocks/getresult';

describe('API endpoint mocks (direct import style)', () => {
  test('getplan returns a mocked plan ID', () => {
    // Fake request and response objects
    const req = { method: 'POST', body: { /* normally form data */ } };
    const res = {
      status: jest.fn().mockReturnThis(), // allows chaining .status().json()
      json: jest.fn()
    };

    // Call the mock handler directly
    getplan(req, res);

    // Assert it behaved as expected
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 'mocked-plan-id' });
  });

  test('getresult returns a mocked plan document', () => {
    const req = { method: 'GET', query: { id: 'mocked-plan-id' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    getresult(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      plan: expect.any(Object),
      createdAt: expect.any(Date),
      userId: 'mocked-user-id',
    }));
  });
});
