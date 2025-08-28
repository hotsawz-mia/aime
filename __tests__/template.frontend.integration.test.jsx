/**
 * @jest-environment jsdom
 *
 * Template: Frontend INTEGRATION-ish test
 * - Renders the real component
 * - Mocks fetch (network) and the router
 * - Submits valid data and asserts navigation
 *
 * 🔧 How to adapt:
 *  1) Change the import to your component.
 *  2) Update field labels/placeholders to match your form.
 *  3) Adjust the mocked fetch response shape to your API.
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as nextRouter from "next/router";

// ✅ CHANGE this import to your component under test
import AimePlannerForm from "../pages/form.jsx";

beforeEach(() => {
  // Clean per-test fetch mock
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test("submits and navigates on success (integration)", async () => {
  // Arrange: mock a successful POST that returns an id
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ id: "123" }),
  });

  // Arrange router: useRouter().push
  const push = jest.fn();
  jest.spyOn(nextRouter, "useRouter").mockReturnValue({ push });

  // Render
  render(<AimePlannerForm />);

  // Fill minimal valid data (adjust labels/selectors to your form)
  fireEvent.change(screen.getByLabelText(/What’s your Aime/i), {
    target: { value: "Goal" },
  });
  fireEvent.change(screen.getByLabelText(/What does success/i), {
    target: { value: "Win" },
  });
  fireEvent.change(screen.getByLabelText(/What level are you currently/i), {
    target: { value: "Beginner" },
  });

  const future = new Date(Date.now() + 7 * 24 * 3600 * 1000)
    .toISOString()
    .slice(0, 10);
  fireEvent.change(screen.getByLabelText(/When do you want/i), {
    target: { value: future },
  });

  fireEvent.change(screen.getByLabelText(/How much time per day/i), {
    target: { value: "15" },
  });

  // Submit
  fireEvent.click(screen.getByRole("button", { name: /plan my goal/i }));

  // Assert: network was called and router navigated
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  await waitFor(() => expect(push).toHaveBeenCalledWith("/plan/123"));
});

// 💡 More ideas:
// - Assert correct POST body shape (use `expect.any(String)` for dates if needed)
// - Handle non-200 responses and verify an error banner/toast is shown