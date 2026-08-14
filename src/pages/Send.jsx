import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { getErrorMessage } from '../api/errors'
import { transfer } from '../api/wallet'
import ActionButton from '../components/ActionButton'
import CategorySuggestField from '../components/CategorySuggestField'
import FormField from '../components/FormField'
import TextInput from '../components/TextInput'
import { useInvalidateAfterTransfer, useWallet } from '../hooks/useWallet'
import { displayNameFromEmail, formatCurrency } from '../utils/format'
import { insightToTransactionCategory } from '../utils/categories'

function validateSend({ receiverEmail, amount, balance }) {
  if (!receiverEmail.trim()) {
    return 'Enter a recipient email'
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Enter an amount greater than zero'
  }

  if (amount > balance) {
    return 'Insufficient balance'
  }

  return null
}

export default function Send() {
  const invalidateAfterTransfer = useInvalidateAfterTransfer()
  const { data: wallet, isLoading: walletLoading } = useWallet()
  const [receiverEmail, setReceiverEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [insightCategory, setInsightCategory] = useState(null)
  const [fieldError, setFieldError] = useState('')
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(null)

  const balance = Number(wallet?.balance ?? 0)
  const parsedAmount = amount === '' ? NaN : Number(amount)

  const mutation = useMutation({
    mutationFn: ({ receiverEmail: email, amount: sendAmount, category }) =>
      transfer({
        receiverEmail: email,
        amount: sendAmount,
        category: insightToTransactionCategory(category) || 'TRANSFER',
      }),
    onSuccess: async (_data, variables) => {
      // Wait for fresh server data before showing success — no optimistic UI
      await invalidateAfterTransfer()
      setSuccess({
        amount: variables.amount,
        recipient: displayNameFromEmail(variables.receiverEmail),
        email: variables.receiverEmail,
      })
    },
    onError: (err) => {
      setServerError(getErrorMessage(err, 'Transfer failed'))
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    setFieldError('')
    setServerError('')

    const validationError = validateSend({
      receiverEmail,
      amount: parsedAmount,
      balance,
    })

    if (validationError) {
      setFieldError(validationError)
      return
    }

    mutation.mutate({
      receiverEmail: receiverEmail.trim(),
      amount: parsedAmount,
      category: insightCategory,
    })
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="rounded-2xl border border-positive/30 bg-surface p-6 text-center">
          <p className="font-heading text-xl font-semibold text-text-primary">
            Sent {formatCurrency(success.amount)} to {success.recipient}
          </p>
          <p className="mt-2 font-body text-sm text-text-muted">{success.email}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <ActionButton to="/dashboard" className="w-full sm:w-auto">
              Back to dashboard
            </ActionButton>
            <ActionButton
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => {
                setSuccess(null)
                setReceiverEmail('')
                setAmount('')
                setDescription('')
                setInsightCategory(null)
              }}
            >
              Send again
            </ActionButton>
          </div>
        </div>
      </div>
    )
  }

  const amountHintError =
    fieldError === 'Enter an amount greater than zero' ||
    fieldError === 'Insufficient balance'
      ? fieldError
      : ''

  const emailHintError = fieldError === 'Enter a recipient email' ? fieldError : ''
  const bannerError = serverError || (fieldError && !amountHintError && !emailHintError ? fieldError : '')

  return (
    <div className="mx-auto max-w-lg">
      <header className="mb-6">
        <h2 className="font-heading text-2xl font-bold text-text-primary">Send money</h2>
        <p className="mt-1 font-body text-sm text-text-muted">
          {walletLoading ? 'Loading balance…' : `Balance: ${formatCurrency(balance)}`}
        </p>
      </header>

      <div className="rounded-2xl border border-border-hairline bg-surface p-5">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {bannerError && (
            <p
              className="rounded-xl border border-negative/30 bg-negative/10 px-4 py-3 font-body text-sm text-negative"
              role="alert"
            >
              {bannerError}
            </p>
          )}

          <FormField label="Recipient email" id="receiver-email" error={emailHintError}>
            <TextInput
              id="receiver-email"
              type="email"
              autoComplete="email"
              placeholder="rahul@example.com"
              value={receiverEmail}
              onChange={(e) => {
                setReceiverEmail(e.target.value)
                setFieldError('')
                setServerError('')
              }}
              disabled={mutation.isPending}
            />
          </FormField>

          <FormField label="Amount" id="amount" error={amountHintError}>
            <TextInput
              id="amount"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              placeholder="500"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setFieldError('')
                setServerError('')
              }}
              disabled={mutation.isPending}
            />
          </FormField>

          <CategorySuggestField
            description={description}
            onDescriptionChange={setDescription}
            onCategoryChange={setInsightCategory}
            disabled={mutation.isPending}
          />

          <ActionButton
            type="submit"
            className="w-full"
            disabled={mutation.isPending || walletLoading}
          >
            {mutation.isPending
              ? 'Sending…'
              : Number.isFinite(parsedAmount) && parsedAmount > 0
                ? `Send ${formatCurrency(parsedAmount)}`
                : 'Send money'}
          </ActionButton>
        </form>
      </div>

      <p className="mt-4 text-center font-body text-sm text-text-muted">
        <Link to="/dashboard" className="focus-ring text-accent-gold hover:underline">
          Cancel
        </Link>
      </p>
    </div>
  )
}
