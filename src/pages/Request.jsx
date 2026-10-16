import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { getErrorMessage } from '../api/errors'
import { requestMoney } from '../api/wallet'
import ActionButton from '../components/ActionButton'
import AlertBanner from '../components/AlertBanner'
import FormField from '../components/FormField'
import FormPanel from '../components/FormPanel'
import PageHeader from '../components/PageHeader'
import SuccessPanel from '../components/SuccessPanel'
import TextInput from '../components/TextInput'
import { useInvalidateMoneyQueries } from '../hooks/useWallet'
import { displayNameFromEmail, formatCurrency } from '../utils/format'
import { validateEmail, validatePositiveAmount } from '../utils/validation'

export default function Request() {
  const invalidateMoneyQueries = useInvalidateMoneyQueries()
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(null)

  const parsedAmount = amount === '' ? NaN : Number(amount)

  const mutation = useMutation({
    mutationFn: ({ payerEmail, amount: requestAmount }) =>
      requestMoney({ payerEmail, amount: requestAmount }),
    onSuccess: async (_data, variables) => {
      await invalidateMoneyQueries()
      setSuccess({
        amount: variables.amount,
        name: displayNameFromEmail(variables.payerEmail),
        email: variables.payerEmail,
      })
    },
    onError: (err) => {
      setServerError(getErrorMessage(err, 'Could not send request'))
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    setServerError('')

    const errors = {}
    const emailError = validateEmail(email)
    const amountError = validatePositiveAmount(amount)
    if (emailError) errors.email = emailError
    if (amountError) errors.amount = amountError

    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    mutation.mutate({
      payerEmail: email.trim(),
      amount: Number(amount),
    })
  }

  if (success) {
    return (
      <SuccessPanel
        title={`Requested ${formatCurrency(success.amount)} from ${success.name}`}
        description={`${success.email} — saved as a pending request in Activity`}
        primaryAction={{ to: '/transactions', label: 'View activity' }}
        secondaryAction={{
          label: 'Request again',
          onClick: () => {
            setSuccess(null)
            setEmail('')
            setAmount('')
            setFieldErrors({})
          },
        }}
      />
    )
  }

  return (
    <div className="page-stack mx-auto max-w-lg">
      <PageHeader
        eyebrow="Incoming"
        title="Request money"
        description="Create a pending request for another wallet user. Balances do not change until they send you money."
      />

      <FormPanel onSubmit={handleSubmit}>
        {serverError && <AlertBanner>{serverError}</AlertBanner>}

        <FormField label="Their email" id="email" error={fieldErrors.email}>
          <TextInput
            id="email"
            type="email"
            placeholder="friend@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setServerError('')
            }}
            disabled={mutation.isPending}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
          />
        </FormField>

        <FormField label="Amount" id="amount" error={fieldErrors.amount}>
          <TextInput
            id="amount"
            type="number"
            min="1"
            step="1"
            placeholder="500"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value)
              setServerError('')
            }}
            disabled={mutation.isPending}
            aria-invalid={Boolean(fieldErrors.amount)}
            aria-describedby={fieldErrors.amount ? 'amount-error' : undefined}
          />
        </FormField>

        <ActionButton type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending
            ? 'Sending request…'
            : Number.isFinite(parsedAmount) && parsedAmount > 0
              ? `Request ${formatCurrency(parsedAmount)}`
              : 'Request money'}
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
