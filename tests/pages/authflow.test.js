import React from "react";
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";

// FORCE Jest to use mocks
jest.mock("../../pages/[[...index]]", () => {
  return require("../../__mocks__/pages/[[...index]]").default;
});
// Mock the router - notice this has to happen before importing the component
// as the component imports these modules.
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/link", () => {
  return ({ href, children }) => (
    <button onClick={() => require("next/router").useRouter().push(href)}>
      {children}
    </button>
  );
});

// note: you have to mock the import that the home page is using to avoid
// importing the real clerk - without this tests fail due to es-module import
// compatibility
jest.mock("@clerk/nextjs/server", () => ({
  getAuth: jest.fn(() => ({ userId: 'user_123' }))
}));

import Home from "../../pages/[[...index]]";
const AimePlannerForm = require("../../pages/form").default;
// import NormalizePlan from "../../pages/[[...index]]"


describe('This is a simple practice test suite', ()=>{
    test('checks a calculation', ()=>{
        const result = 2 + 2;
        expect(result).toBe(4);
    })
})

describe('signed in and signed out', ()=>{
  test('a signed out user sees a page with sign in and signup links', () => {
    render(<Home/>)
    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
    expect(screen.getByTestId('sign-up-link')).toBeInTheDocument();        
  })
    test('test that a logged in user gets redirected to show a page with sign and and make a plan', () =>{
        const { useUser } = require("@clerk/nextjs");
        useUser.mockReturnValue({
        isSignedIn: true,
        user: { id: "user_123", email: "test@example.com" },
        });
        render(<Home/>)
        expect(screen.getByText(/sign out/i)).toBeInTheDocument();
        expect(screen.getByText(/Make a plan/i)).toBeInTheDocument();
    })

      test('test that a make a plan link navigates to the form page when clicked', async () => {
    const { useUser } = require("@clerk/nextjs");
    useUser.mockReturnValue({
      isSignedIn: true,
      user: { id: "user_123", email: "test@example.com" },
    });

    // Mock the router
    const push = jest.fn();
    jest.spyOn(require("next/router"), "useRouter").mockReturnValue({ push });

    render(<Home />);
    const makeAPlanLink = screen.getByText(/Make a plan/i);
    await userEvent.click(makeAPlanLink);

    expect(push).toHaveBeenCalledWith("/form");
  });
// add this comonent -level test later if required. Clerk Middleware currently handles this scenario effectively
//   test('form page redirects or blocks access when not logged in', () => {
//   const { useUser } = require("@clerk/nextjs");
//   useUser.mockReturnValue({
//     isSignedIn: false,
//     user: null,
//   });

//   // Render your form page component here (e.g., <FormPage />)
//   render(<AimePlannerForm />);

//   // Assert that the user is redirected, or a sign-in prompt is shown
//   expect(screen.getByText(/sign in/i)).toBeInTheDocument();
//   // Or, if you redirect, check for navigation or a message
// });

test('signout button returns the user to the home page from the planid page', async () => {
  const { useUser } = require("@clerk/nextjs");
  useUser.mockReturnValue({
    isSignedIn: true,
    user: { id: "user_123", email: "test@example.com" },
  });

  // Mock the router
  const push = jest.fn();
  jest.spyOn(require("next/router"), "useRouter").mockReturnValue({ push });

     render(<Home />);

  // Find and click the signout button
  const signOutButton = screen.getByText(/sign out/i);
  await userEvent.click(signOutButton);

  // Assert that the user is redirected to the home page
  expect(push).toHaveBeenCalledWith("/");
});
})

