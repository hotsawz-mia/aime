const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
const { useUser } = require('@clerk/nextjs');
const { useRouter } = require('next/router');
require('@testing-library/jest-dom');

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
  ClerkProvider: ({ children }) => <>{children}</>,
}));

function TestComponent() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  return (
    <div>
      <span>{isSignedIn ? 'Logged in' : 'Logged out'}</span>
      <button onClick={() => router.push('/test')}>Go</button>
    </div>
  );
}

describe('Jest + ESM setup smoke test', () => {
  const push = jest.fn();

  beforeEach(() => {
    useUser.mockReturnValue({
      isSignedIn: true,
      user: { id: 'user_123', email: 'test@example.com' },
    });
    useRouter.mockReturnValue({ push });
  });

  test('renders component and handles event', () => {
    render(<TestComponent />);
    expect(screen.getByText(/logged in/i)).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /go/i });
    fireEvent.click(button);

    expect(push).toHaveBeenCalledWith('/test');
  });
});
