export const ClerkProvider = ({ children }) => <>{children}</>;

export const useUser = jest.fn(() => ({
  isSignedIn: true,
  user: { id: 'user_123', email: 'test@example.com' },
}));

export const useClerk = jest.fn(() => ({
  signOut: jest.fn(),
}));

export const withAuth = (Component) => Component;
