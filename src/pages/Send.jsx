import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { getErrorMessage } from '../api/errors'
import { transfer } from '../api/wallet'
import ActionButton from '../components/ActionButton'
import AlertBanner from '../components/AlertBanner'
import CategorySuggestField from '../components/CategorySuggestField'
import FormField from '../components/FormField'
import FormPanel from '../components/FormPanel'
import PageHeader from '../components/PageHeader'
import SuccessPanel from '../components/SuccessPanel'
import TextInput from '../components/TextInput'
import { useInvalidateMoneyQueries, useWallet } from '../hooks/useWallet'
import { displayNameFromEmail, formatCurrency } from '../utils/format'
import { insightToTransactionCategory } from '../utils/categories'
import { validateEmail, validatePositiveAmount } from '../utils/validation'

function validateSend({ receiverEmail, amount, balance }) {
  const emailError = validateEmail(receiverEmail)
  if (emailError) {
    return emailError === 'Enter your email address'
      ? 'Enter a recipient email'
      : emailError
  }

  const amountError = validatePositiveAmount(Number.isFinite(amount) ? amount : '')
  if (amountError) return amountError

  if (Number(amount) > balance) {
    return 'Insufficient balance'
  }

  return null
}

function splitFieldError(fieldError) {
  const amountHintError =
    fieldError === 'Enter an amount' ||
    fieldError === 'Enter an amount greater than zero' ||
    fieldError === 'Insufficient balance'
      ? fieldError
      : ''

  const emailHintError =
    fieldError === 'Enter a valid email address' || fieldError === 'Enter a recipient email'
      ? fieldError
      : ''

  const bannerError =
    fieldError && !amountHintError && !emailHintError ? fieldError : ''

  return { amountHintError, emailHintError, bannerError }
}

export default function Send() {
  const invalidateMoneyQueries = useInvalidateMoneyQueries()
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
      await invalidateMoneyQueries()
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

  function resetForm() {
    setSuccess(null)
    setReceiverEmail('')
    setAmount('')
    setDescription('')
    setInsightCategory(null)
    setFieldError('')
    setServerError('')
  }

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
      <SuccessPanel
        title={`Sent ${formatCurrency(success.amount)} to ${success.recipient}`}
        description={success.email}
        primaryAction={{ to: '/dashboard', label: 'Back to dashboard' }}
        secondaryAction={{ label: 'Send again', onClick: resetForm }}
      />
    )
  }

  const { amountHintError, emailHintError, bannerError: fieldBanner } = splitFieldError(fieldError)
  const bannerError = serverError || fieldBanner

  return (
    <div className="page-stack mx-auto max-w-lg">
      <PageHeader
        eyebrow="Transfer"
        title="Send money"
        description={
          walletLoading ? 'Loading balance…' : `Available balance ${formatCurrency(balance)}`
        }
      />

      <FormPanel onSubmit={handleSubmit}>
        {bannerError && <AlertBanner>{bannerError}</AlertBanner>}

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
          loading={mutation.isPending}
          disabled={walletLoading}
        >
          {mutation.isPending
            ? 'Sending…'
            : Number.isFinite(parsedAmount) && parsedAmount > 0
              ? `Send ${formatCurrency(parsedAmount)}`
              : 'Send money'}
        </ActionButton>
      </FormPanel>

      <p className="text-center font-body text-sm text-text-muted">
        <Link to="/dashboard" className="focus-ring text-accent-gold hover:underline">
          Cancel
        </Link>
      </p>
    </div>
  )
}
