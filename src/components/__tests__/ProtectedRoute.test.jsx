import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProtectedRoute from '../ProtectedRoute'
import { useAuth } from '../../contexts/AuthContext'

// Mock useAuth hook
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn()
}))

// Mock Navigate component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Navigate: ({ to }) => <div data-testid="navigate">Redirecting to {to}</div>
  }
})

const TestChild = () => <div data-testid="protected-content">Protected Content</div>

describe('ProtectedRoute', () => {
  it('должен отображать загрузку при проверке аутентификации', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: true
    })

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      </BrowserRouter>
    )

    expect(screen.getByText('Проверка аутентификации...')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('должен перенаправлять на /auth если пользователь не аутентифицирован', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false
    })

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      </BrowserRouter>
    )

    expect(screen.getByTestId('navigate')).toHaveTextContent('Redirecting to /auth')
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })

  it('должен отображать защищенный контент если пользователь аутентифицирован', () => {
    useAuth.mockReturnValue({
      user: { email: 'test@example.com', id: '123' },
      loading: false
    })

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      </BrowserRouter>
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument()
  })
})