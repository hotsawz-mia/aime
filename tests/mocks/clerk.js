export const ClerkProvider = ({ children }) => <>{children}</>;

export const useUser = jest.fn(() => ({
  isSignedIn: true,
  user: { id: 'user_123', email: 'test@example.com' },
}));

export const useClerk = jest.fn(() => ({
  signOut: jest.fn(),
}));

export const withAuth = (Component) => Component;

export const SignedIn = ({ children }) => <>{children}</>;
export const SignedOut = ({ children }) => <>{children}</>;
export const SignInButton = ({ children }) => <button>{children || "Sign In"}</button>;
export const SignOutButton = ({ children }) => <button>{children || "Sign Out"}</button>;
export const SignUp = ({ children }) => <button>{children || "Sign Up"}</button>;


