// __tests__/auth.test.jsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import Landing from '../pages/landing'
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider/next-13.5'
import { vi } from 'vitest'

// --- MOCK @clerk/nextjs ---
vi.mock('@clerk/nextjs', () => ({
  SignedIn: ({ children }) => <>{children}</>,
  SignedOut: ({ children }) => <>{children}</>,
  useAuth: vi.fn(() => ({ userId: 'user-id' })), // default logged in
  SignOutButton: () => <button>Sign Out</button>,
  useUser: vi.fn(() => ({ user: { id: 'user-id' } })),
  ClerkProvider: ({ children }) => <>{children}</>,
}))

import { useAuth } from '@clerk/nextjs'

// --- CUSTOM PROVIDER COMPONENT ---
const TestProviders = ({ isLoggedIn = true, children }) => {
  useAuth.mockReturnValue({ userId: isLoggedIn ? 'user-id' : null })

  return <MemoryRouterProvider>{children}</MemoryRouterProvider>
}

// --- HELPER TO RENDER WITH PROVIDERS ---
const renderWithProviders = (ui, isLoggedIn = true) => {
  return render(<TestProviders isLoggedIn={isLoggedIn}>{ui}</TestProviders>)
}

// --- TESTS ---
describe('Landing Page', () => {
  it('renders landing page content when authenticated', () => {
    renderWithProviders(<Landing />, true)
    expect(screen.getByText('This is the events page')).toBeInTheDocument()
    expect(screen.getByText('Sign Out')).toBeInTheDocument()
  })

})
