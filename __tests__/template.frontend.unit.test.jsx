/**
 * @jest-environment jsdom
 *
 * Template: Frontend UNIT test
 * - Renders the component
 * - Asserts key fields are present
 * - No real network, no real router usage
 *
 * 🔧 How to adapt:
 *  1) Change the import to your component.
 *  2) Update the label text matchers to your form’s labels.
 */

import React from "react";
import { render, screen } from "@testing-library/react";

// ✅ CHANGE this import to your component under test
import AimePlannerForm from "../pages/form.jsx";

// Local router mock (keeps unit tests self-contained)
jest.mock("next/router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

test("renders form fields (unit)", () => {
  render(<AimePlannerForm />);
  expect(screen.getByLabelText(/What’s your Aime/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/What does success/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/What level are you currently/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/When do you want/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/How much time per day/i)).toBeInTheDocument();
});

// 💡 More ideas:
// - Client-side validation messages on submit
// - Per-field error clearing
// - Input formatting helpers (e.g., min date)