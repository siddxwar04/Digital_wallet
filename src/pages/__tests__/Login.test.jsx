import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Login from '../Login'
import { login } from '../../api/auth'

vi.mock('../../api/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
}))

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  )
}

const submitButton = () => screen.getByRole('button', { name: /sign in/i })

describe('Login form validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reports both fields when the form is submitted empty', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(submitButton())

    expect(await screen.findByText('Enter your email address')).toBeInTheDocument()
    expect(screen.getByText('Enter your password')).toBeInTheDocument()
    expect(login).not.toHaveBeenCalled()
  })

  it('rejects a malformed email address', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.type(screen.getByLabelText('Password'), 'secret123')
    await user.click(submitButton())

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument()
    expect(login).not.toHaveBeenCalled()
  })

  it('marks the invalid field with aria-invalid', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(submitButton())

    await screen.findByText('Enter your email address')
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription(
      'Enter your email address',
    )
  })

  it('calls the login API once both fields are valid', async () => {
    const user = userEvent.setup()
    login.mockResolvedValue({
      token: 'fake-jwt',
      userId: 1,
      name: 'Rahul',
      email: 'rahul@example.com',
    })
    renderLogin()

    await user.type(screen.getByLabelText('Email'), 'rahul@example.com')
    await user.type(screen.getByLabelText('Password'), 'secret123')
    await user.click(submitButton())

    expect(login).toHaveBeenCalledWith('rahul@example.com', 'secret123')
  })

  it('shows the server message when the credentials are rejected', async () => {
    const user = userEvent.setup()
    login.mockRejectedValue({
      response: { data: { message: 'Invalid email or password' } },
    })
    renderLogin()

    await user.type(screen.getByLabelText('Email'), 'rahul@example.com')
    await user.type(screen.getByLabelText('Password'), 'wrong-password')
    await user.click(submitButton())

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password')
  })
})
