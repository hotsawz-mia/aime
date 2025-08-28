import React from "react";
import { render, screen, fireEvent, within} from "@testing-library/react";

jest.mock("next/router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

function Hello() {
  return <h1>hello</h1>;
}

test("renders", () => {
  render(<Hello />);
  expect(screen.getByText(/hello/i)).toBeInTheDocument();
});

import AimePlannerForm from "../pages/form";

test("renders all form fields", () => {
  render(<AimePlannerForm />);
  expect(screen.getByLabelText(/What’s your Aime/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/What does success/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/What level are you currently/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/When do you want/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/How much time per day/i)).toBeInTheDocument();
});

test("shows errors when submitting empty form", () => {
  render(<AimePlannerForm />);
  fireEvent.click(screen.getByRole("button", { name: /plan my goal/i }));
  // required fields
  expect(screen.getAllByText(/this field is required\./i)).toHaveLength(4); // aime, success, startLevel, targetDate
  // numeric range
  expect(screen.getByText(/number between 1 and 60/i)).toBeInTheDocument();
});

test("clears error when user types", () => {
  render(<AimePlannerForm />);

  // trigger all errors
  fireEvent.click(screen.getByRole("button", { name: /plan my goal/i }));

  // find the Aime input and its nearest field container
  const aimeInput = screen.getByLabelText(/what’s your aime\?/i);
  const aimeGroup = aimeInput.closest(".form-control");

  // sanity: Aime had an error initially
  expect(within(aimeGroup).getByText(/this field is required\./i)).toBeInTheDocument();

  // user fixes only Aime
  fireEvent.change(aimeInput, { target: { value: "Learn guitar" } });

  // the Aime-scoped error disappears, others can remain
  expect(within(aimeGroup).queryByText(/this field is required\./i)).not.toBeInTheDocument();
});

test("rejects past dates", () => {
  render(<AimePlannerForm />);
  fireEvent.change(screen.getByLabelText(/When do you want/i), {
    target: { value: "2000-01-01" },
  });
  fireEvent.click(screen.getByRole("button", { name: /plan my goal/i }));
  expect(screen.getByText(/Please pick a date in the future/i)).toBeInTheDocument();
});