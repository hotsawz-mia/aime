import React from "react";
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import Home from "../../pages/[[...index]]";

describe('This is a simple practice test suite', ()=>{
    test('checks a calculation', ()=>{
        const result = 2 + 2;
        expect(result).toBe(4);
    })
})

describe('signed in and signed out', ()=>{
    test('a signed out user sees a page with sign in and signup links', ()=>{
        // setup
        render(<Home/>)
        expect(screen.getByText(/sign in/i)).toBeInTheDocument();
        expect(screen.getByText(/sign up/i)).toBeInTheDocument();        
    })
    test('// test that a logged in user gets redirected to show a page with', () =>{
        const { useUser } = require("@clerk/nextjs");
        useUser.mockReturnValue({
        isSignedIn: true,
        user: { id: "user_123", email: "test@example.com" },
        });
        render(<Home/>)
        expect(screen.getByText(/sign out/i)).toBeInTheDocument();
        expect(screen.getByText(/Make a plan/i)).toBeInTheDocument();
    })
})

// test that a logged in user gets redirected to show a page with
// signout button/link

// tests that a logged out user is presented with a signin 
// and signup link or button

// tests that the home page has a link to the formpage

// tests that the the link navigates to the form page when logged in
// tests that the form page is protected when not logged in
// tests that the signout button returns the user to the home page
// from the planid page