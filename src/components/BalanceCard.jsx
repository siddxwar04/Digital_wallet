import { useCountUp } from '../hooks/useCountUp'
import { formatCurrency } from '../utils/format'

export default function BalanceCard({ balance, currency = 'INR', loading }) {
  const animatedBalance = useCountUp(loading ? 0 : balance)

  return (
    <section className="relative overflow-hidden rounded-hero border border-border-hairline bg-surface px-6 py-7 sm:px-8 sm:py-8">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-accent-gold"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-accent-gold/10 blur-3xl"
        aria-hidden="true"
      />

      <p className="section-label">Available balance</p>
      {loading ? (
        <p className="font-heading mt-3 text-display text-text-faint">…</p>
      ) : (
        <p className="font-heading mt-3 text-display tabular-nums text-text-primary">
          {formatCurrency(animatedBalance)}
        </p>
      )}
      {!loading && currency && (
        <p className="mt-2 font-body text-sm text-text-muted">
          Settled in <span className="text-text-primary">{currency}</span>
        </p>
      )}
    </section>
  )
}
