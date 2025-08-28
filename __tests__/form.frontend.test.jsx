import React from "react";
import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import * as nextRouter from "next/router";
import AimePlannerForm from "../pages/form.jsx";


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

// past-date validation
test("shows future-date error", () => {
  render(<AimePlannerForm />);
  fireEvent.change(screen.getByLabelText(/aime/i), { target: { value: "G" } });
  fireEvent.change(screen.getByLabelText(/success/i), { target: { value: "S" } });
  fireEvent.change(screen.getByLabelText(/level/i), { target: { value: "L" } });
  fireEvent.change(screen.getByLabelText(/achieved this goal/i), { target: { value: "2000-01-01" },});
  fireEvent.change(screen.getByLabelText(/how much time per day/i), { target: { value: "10" },});
  fireEvent.click(screen.getByRole("button", { name: /plan my goal/i }));
  expect(screen.getByText(/please pick a date in the future\./i)).toBeInTheDocument();
});

// timePerDay bounds
// test("rejects timePerDay outside 1–60", () => {
//   render(<AimePlannerForm />);
//   fireEvent.change(screen.getByLabelText(/how much time per day/i), { target: { value: "0" } });
//   fireEvent.click(screen.getByRole("button", { name: /plan my goal/i }));
//   const timeGroup = screen.getByLabelText(/how much time per day/i).closest(".form-control");
//   expect(within(timeGroup).getByText(/between 1 and 60/i)).toBeInTheDocument();
// });