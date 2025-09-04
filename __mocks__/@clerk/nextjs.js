import React from "react";

export const ClerkProvider = ({ children }) => <>{children}</>;

export const useUser = jest.fn(() => ({
  isSignedIn: false,  // Default to signed out
  user: null,
}));

export const useClerk = jest.fn(() => ({
  signOut: jest.fn(),
}));

export const withAuth = (Component) => Component;

// FIX: Make these actually conditional based on useUser
export const SignedIn = ({ children }) => {
  const { isSignedIn } = useUser();
  return isSignedIn ? <>{children}</> : null;
};

export const SignedOut = ({ children }) => {
  const { isSignedIn } = useUser();
  return !isSignedIn ? <>{children}</> : null;
};

export const SignInButton = ({ children }) => {
  return React.cloneElement(children, { 
    'data-testid': 'sign-in-button'
  });
};

export const SignOutButton = ({ children }) => {
  const handleClick = () => {
    try {
      const router = require("next/router").useRouter();
      router.push("/");
    } catch (err) {
      console.log("Sign out clicked");
    }
  };
  
  return React.cloneElement(children, { 
    onClick: handleClick,
    'data-testid': 'sign-out-button'
  });
};

export const SignUp = ({ children }) => {
  return React.cloneElement(children, { 
    'data-testid': 'sign-up-button'
  });
};