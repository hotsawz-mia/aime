/** @jest-environment jsdom */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock CSS import first, before importing the form component
jest.mock("react-day-picker/style.css", () => ({}));

import AimePlannerForm from "../pages/form";

// Mock Next router (capture push so we can assert on it)
const mockPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock window.alert so failures don’t pop UI and we can assert on it
window.alert = jest.fn();

describe("AimePlannerForm -> submit API flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("submits valid data, calls /api/getplan and navigates to /plan/:id", async () => {
    // Mock fetch success
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({ id: "123" }),
    });

    render(<AimePlannerForm />);

    // Fill all required fields
    fireEvent.change(screen.getByLabelText(/What’s your Aime/i), {
      target: { value: "Learn guitar" },
    });
    fireEvent.change(screen.getByLabelText(/What does success/i), {
      target: { value: "Play a song live" },
    });
    fireEvent.change(screen.getByLabelText(/What level are you currently/i), {
      target: { value: "Beginner" },
    });
    fireEvent.change(screen.getByLabelText(/When do you want/i), {
      target: { value: "2099-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/How much time per day/i), {
      target: { value: "15" },
    });

    fireEvent.click(screen.getByRole("button", { name: /plan my goal/i }));

    // Assert fetch called with correct payload (wait for async)
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(fetch).toHaveBeenCalledWith(
      "/api/getplan",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          aim: "Learn guitar",
          success: "Play a song live",
          startingLevel: "Beginner",
          targetDate: "2099-01-01",
          timePerDay: "15", // note: form sends string
        }),
      })
    );

    // Wait for navigation to be triggered
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/plan/123"));
    expect(mockPush).toHaveBeenCalledWith("/plan/123");
  });

  test("on non-OK fetch, shows alert and does not navigate", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({}),
    });

    render(<AimePlannerForm />);

    // Minimal valid inputs
    fireEvent.change(screen.getByLabelText(/What’s your Aime/i), {
      target: { value: "A" },
    });
    fireEvent.change(screen.getByLabelText(/What does success/i), {
      target: { value: "B" },
    });
    fireEvent.change(screen.getByLabelText(/What level are you currently/i), {
      target: { value: "C" },
    });
    fireEvent.change(screen.getByLabelText(/When do you want/i), {
      target: { value: "2099-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/How much time per day/i), {
      target: { value: "10" },
    });

    fireEvent.click(screen.getByRole("button", { name: /plan my goal/i }));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("Could not save.")
      );
    expect(mockPush).not.toHaveBeenCalled();
  });

  test("client-side validation blocks submit when fields are empty", () => {
    global.fetch = jest.fn(); // should not be called

    render(<AimePlannerForm />);
    fireEvent.click(screen.getByRole("button", { name: /plan my goal/i }));

    // Required errors render
    expect(
      screen.getAllByText(/this field is required\./i).length
    ).toBeGreaterThanOrEqual(3);

    // No network call
    expect(fetch).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});