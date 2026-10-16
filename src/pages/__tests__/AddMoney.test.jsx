import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AddMoney from '../AddMoney'
import { addMoney } from '../../api/wallet'
import { useWallet } from '../../hooks/useWallet'

vi.mock('../../api/wallet', () => ({
  addMoney: vi.fn(),
  getWallet: vi.fn(),
  transfer: vi.fn(),
  requestMoney: vi.fn(),
}))

vi.mock('../../hooks/useWallet', () => ({
  useWallet: vi.fn(),
  useInvalidateMoneyQueries: () => vi.fn(),
}))

function renderAddMoney() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <AddMoney />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('Add money flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useWallet.mockReturnValue({
      data: { balance: 500, currency: 'INR' },
      isLoading: false,
    })
  })

  it('blocks submit for invalid amount', async () => {
    const user = userEvent.setup()
    renderAddMoney()

    await user.type(screen.getByLabelText('Amount'), '0')
    await user.click(screen.getByRole('button', { name: /add/i }))

    expect(await screen.findByText(/greater than zero|must be/i)).toBeInTheDocument()
    expect(addMoney).not.toHaveBeenCalled()
  })

  it('calls addMoney with a valid amount', async () => {
    const user = userEvent.setup()
    addMoney.mockResolvedValue({ balance: 1500 })
    renderAddMoney()

    await user.type(screen.getByLabelText('Amount'), '1000')
    await user.click(screen.getByRole('button', { name: /add/i }))

    expect(addMoney).toHaveBeenCalledWith(1000)
    expect(await screen.findByText(/Added/i)).toBeInTheDocument()
  })
})
