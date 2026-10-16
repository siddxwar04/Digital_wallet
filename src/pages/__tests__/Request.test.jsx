import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Request from '../Request'
import { requestMoney } from '../../api/wallet'

vi.mock('../../api/wallet', () => ({
  requestMoney: vi.fn(),
  getWallet: vi.fn(),
  transfer: vi.fn(),
  addMoney: vi.fn(),
}))

vi.mock('../../hooks/useWallet', () => ({
  useInvalidateMoneyQueries: () => vi.fn(),
}))

function renderRequest() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <Request />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('Request money flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('blocks submit when email is invalid', async () => {
    const user = userEvent.setup()
    renderRequest()

    await user.type(screen.getByLabelText('Their email'), 'not-an-email')
    await user.type(screen.getByLabelText('Amount'), '100')
    await user.click(screen.getByRole('button', { name: /request/i }))

    expect(await screen.findByText(/valid email/i)).toBeInTheDocument()
    expect(requestMoney).not.toHaveBeenCalled()
  })

  it('calls requestMoney with payer email and amount', async () => {
    const user = userEvent.setup()
    requestMoney.mockResolvedValue({ id: 1, status: 'PENDING' })
    renderRequest()

    await user.type(screen.getByLabelText('Their email'), 'friend@example.com')
    await user.type(screen.getByLabelText('Amount'), '250')
    await user.click(screen.getByRole('button', { name: /request/i }))

    expect(requestMoney).toHaveBeenCalledWith({
      payerEmail: 'friend@example.com',
      amount: 250,
    })
    expect(await screen.findByText(/Requested/i)).toBeInTheDocument()
  })
})
