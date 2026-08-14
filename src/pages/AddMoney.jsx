import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { getErrorMessage } from '../api/errors'
import { addMoney } from '../api/wallet'
import ActionButton from '../components/ActionButton'
import CategorySuggestField from '../components/CategorySuggestField'
import FormField from '../components/FormField'
import TextInput from '../components/TextInput'
import { useInvalidateAfterTransfer, useWallet } from '../hooks/useWallet'
import { formatCurrency } from '../utils/format'

const quickAmounts = [500, 1000, 2000, 5000]

export default function AddMoney() {
  const navigate = useNavigate()
  const invalidateAfterTransfer = useInvalidateAfterTransfer()
  const { data: wallet } = useWallet()
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const parsedAmount = Number(amount) || 0

  const mutation = useMutation({
    mutationFn: () => addMoney(parsedAmount),
    onSuccess: async () => {
      await invalidateAfterTransfer()
      navigate('/dashboard')
    },
    onError: (err) => {
      setError(getErrorMessage(err, 'Could not add money'))
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    mutation.mutate()
  }

  return (
    <div className="mx-auto max-w-lg">
      <header className="mb-6">
        <h2 className="font-heading text-2xl font-bold text-text-primary">Add money</h2>
        <p className="mt-1 font-body text-sm text-text-muted">
          Balance: {formatCurrency(wallet?.balance ?? 0)}
        </p>
      </header>

      <div className="rounded-2xl border border-border-hairline bg-surface p-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p
              className="rounded-xl border border-negative/30 bg-negative/10 px-4 py-3 font-body text-sm text-negative"
              role="alert"
            >
              {error}
            </p>
          )}

          <FormField label="Amount" id="amount">
            <TextInput
              id="amount"
              type="number"
              min="1"
              step="1"
              placeholder="1000"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setError('')
              }}
              required
            />
          </FormField>

          <CategorySuggestField
            description={description}
            onDescriptionChange={setDescription}
            disabled={mutation.isPending}
          />

          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((qa) => (
              <button
                key={qa}
                type="button"
                onClick={() => setAmount(String(qa))}
                className="focus-ring rounded-lg border border-border-hairline bg-canvas px-3 py-1.5 font-body text-sm text-text-muted transition-transform active:scale-[0.97] hover:border-accent-gold/30 hover:text-text-primary"
              >
                {formatCurrency(qa)}
              </button>
            ))}
          </div>

          <ActionButton
            type="submit"
            className="w-full"
            disabled={!parsedAmount || mutation.isPending}
          >
            {mutation.isPending
              ? 'Adding…'
              : parsedAmount > 0
                ? `Add ${formatCurrency(parsedAmount)}`
                : 'Add money'}
          </ActionButton>
        </form>
      </div>
    </div>
  )
}
