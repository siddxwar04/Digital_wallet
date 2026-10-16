import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { getErrorMessage } from '../api/errors'
import { addMoney } from '../api/wallet'
import ActionButton from '../components/ActionButton'
import AlertBanner from '../components/AlertBanner'
import FormField from '../components/FormField'
import FormPanel from '../components/FormPanel'
import PageHeader from '../components/PageHeader'
import SuccessPanel from '../components/SuccessPanel'
import TextInput from '../components/TextInput'
import { useInvalidateMoneyQueries, useWallet } from '../hooks/useWallet'
import { formatCurrency } from '../utils/format'
import { validatePositiveAmount } from '../utils/validation'

const quickAmounts = [500, 1000, 2000, 5000]

export default function AddMoney() {
  const invalidateMoneyQueries = useInvalidateMoneyQueries()
  const { data: wallet, isLoading: walletLoading } = useWallet()
  const [amount, setAmount] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(null)

  const parsedAmount = amount === '' ? NaN : Number(amount)

  const mutation = useMutation({
    mutationFn: (value) => addMoney(value),
    onSuccess: async (_data, value) => {
      await invalidateMoneyQueries()
      setSuccess({ amount: value })
    },
    onError: (err) => {
      setServerError(getErrorMessage(err, 'Could not add money'))
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    setServerError('')

    const amountError = validatePositiveAmount(amount)
    setFieldError(amountError)
    if (amountError) return

    mutation.mutate(Number(amount))
  }

  if (success) {
    return (
      <SuccessPanel
        title={`Added ${formatCurrency(success.amount)} to your wallet`}
        primaryAction={{ to: '/dashboard', label: 'Back to dashboard' }}
        secondaryAction={{
          label: 'Add more',
          onClick: () => {
            setSuccess(null)
            setAmount('')
            setFieldError('')
          },
        }}
      />
    )
  }

  return (
    <div className="page-stack mx-auto max-w-lg">
      <PageHeader
        eyebrow="Top up"
        title="Add money"
        description={
          walletLoading
            ? 'Loading balance…'
            : `Current balance ${formatCurrency(wallet?.balance ?? 0)}`
        }
      />

      <FormPanel onSubmit={handleSubmit}>
        {serverError && <AlertBanner>{serverError}</AlertBanner>}

        <FormField label="Amount" id="amount" error={fieldError}>
          <TextInput
            id="amount"
            type="number"
            min="1"
            step="1"
            placeholder="1000"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value)
              setFieldError('')
              setServerError('')
            }}
            disabled={mutation.isPending}
            aria-invalid={Boolean(fieldError)}
            aria-describedby={fieldError ? 'amount-error' : undefined}
          />
        </FormField>

        <div>
          <p className="mb-2 font-body text-sm font-medium text-text-muted">Quick amounts</p>
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((qa) => {
              const selected = String(qa) === amount
              return (
                <button
                  key={qa}
                  type="button"
                  onClick={() => {
                    setAmount(String(qa))
                    setFieldError('')
                    setServerError('')
                  }}
                  disabled={mutation.isPending}
                  className={`focus-ring rounded-control border px-3 py-2 font-body text-sm tabular-nums transition-[transform,border-color,color] active:scale-[0.97] disabled:opacity-50 ${
                    selected
                      ? 'border-accent-gold/50 bg-accent-gold-muted text-accent-gold'
                      : 'border-border-hairline bg-ink text-text-muted hover:border-accent-gold/30 hover:text-text-primary'
                  }`}
                >
                  {formatCurrency(qa)}
                </button>
              )
            })}
          </div>
        </div>

        <ActionButton
          type="submit"
          className="w-full"
          loading={mutation.isPending}
          disabled={walletLoading}
        >
          {mutation.isPending
            ? 'Adding…'
            : Number.isFinite(parsedAmount) && parsedAmount > 0
              ? `Add ${formatCurrency(parsedAmount)}`
              : 'Add money'}
        </ActionButton>
      </FormPanel>

      <p className="text-center font-body text-sm text-text-muted">
        <Link
          to="/dashboard"
          className="focus-ring text-accent-gold hover:underline"
          onClick={(e) => {
            if (mutation.isPending) e.preventDefault()
          }}
        >
          Cancel
        </Link>
      </p>
    </div>
  )
}
