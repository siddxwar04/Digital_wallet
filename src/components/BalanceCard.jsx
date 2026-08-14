import { useCountUp } from '../hooks/useCountUp'
import { formatCurrency } from '../utils/format'

export default function BalanceCard({ balance, currency = 'INR', loading }) {
  const animatedBalance = useCountUp(loading ? 0 : balance)

  return (
    <div className="rounded-2xl border border-accent-gold bg-surface p-6">
      <p className="font-body text-sm text-text-muted">Available balance</p>
      {loading ? (
        <p className="font-heading mt-1 text-4xl font-bold text-text-muted md:text-5xl">…</p>
      ) : (
        <p className="font-heading mt-1 text-4xl font-bold tabular-nums text-text-primary md:text-5xl">
          {formatCurrency(animatedBalance)}
        </p>
      )}
      {!loading && currency && (
        <p className="mt-1 font-body text-xs text-text-muted">{currency}</p>
      )}
    </div>
  )
}
