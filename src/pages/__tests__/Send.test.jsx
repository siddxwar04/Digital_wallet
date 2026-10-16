import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Send from '../Send'
import { transfer } from '../../api/wallet'
import { useWallet } from '../../hooks/useWallet'

vi.mock('../../api/wallet', () => ({
  transfer: vi.fn(),
  getWallet: vi.fn(),
  addMoney: vi.fn(),
  requestMoney: vi.fn(),
}))

vi.mock('../../hooks/useWallet', () => ({
  useWallet: vi.fn(),
  useInvalidateMoneyQueries: () => vi.fn(),
  useInvalidateAfterTransfer: () => vi.fn(),
}))

vi.mock('../../hooks/useDebouncedCategorize', () => ({
  useDebouncedCategorize: () => ({
    predictedCategory: null,
    selectedCategory: null,
    isLoading: false,
    source: null,
    overrideCategory: vi.fn(),
  }),
}))

function renderSend() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <Send />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('Send money flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useWallet.mockReturnValue({
      data: { balance: 1000, currency: 'INR' },
      isLoading: false,
    })
  })

  it('blocks submit when the amount exceeds the balance', async () => {
    const user = userEvent.setup()
    renderSend()

    await user.type(screen.getByLabelText('Recipient email'), 'rahul@example.com')
    await user.type(screen.getByLabelText('Amount'), '1500')
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(await screen.findByText('Insufficient balance')).toBeInTheDocument()
    expect(transfer).not.toHaveBeenCalled()
  })

  it('calls transfer with a valid recipient and amount', async () => {
    const user = userEvent.setup()
    transfer.mockResolvedValue({ id: 1 })
    renderSend()

    await user.type(screen.getByLabelText('Recipient email'), 'rahul@example.com')
    await user.type(screen.getByLabelText('Amount'), '250')
    await user.click(screen.getByRole('button', { name: /send ₹250/i }))

    expect(transfer).toHaveBeenCalledWith({
      receiverEmail: 'rahul@example.com',
      amount: 250,
      category: 'TRANSFER',
    })
  })
})
