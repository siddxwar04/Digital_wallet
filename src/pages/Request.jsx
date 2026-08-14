import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionButton from '../components/ActionButton'
import FormField from '../components/FormField'
import TextInput from '../components/TextInput'
import { formatCurrency } from '../utils/format'

export default function Request() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [sent, setSent] = useState(false)

  const parsedAmount = Number(amount) || 0

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
    setTimeout(() => navigate('/dashboard'), 1200)
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="rounded-2xl border border-border-hairline bg-surface p-6 text-center">
          <p className="font-heading text-lg font-semibold text-text-primary">
            Request sent to {email}
          </p>
          <p className="mt-1 font-body text-sm text-text-muted">
            {formatCurrency(parsedAmount)} — they will be notified
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg">
      <header className="mb-6">
        <h2 className="font-heading text-2xl font-bold text-text-primary">Request money</h2>
        <p className="mt-1 font-body text-sm text-text-muted">Ask someone to pay you</p>
      </header>

      <div className="rounded-2xl border border-border-hairline bg-surface p-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Their email" id="email">
            <TextInput
              id="email"
              type="email"
              placeholder="friend@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Amount" id="amount">
            <TextInput
              id="amount"
              type="number"
              min="1"
              step="1"
              placeholder="500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </FormField>

          <ActionButton type="submit" className="w-full" disabled={!email || !parsedAmount}>
            {parsedAmount > 0 ? `Request ${formatCurrency(parsedAmount)}` : 'Request money'}
          </ActionButton>
        </form>
      </div>
    </div>
  )
}
