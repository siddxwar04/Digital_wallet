import { Link } from 'react-router-dom'
import CategoryTag from './CategoryTag'
import { formatCurrency } from '../../utils/format'
import { getTransactionLabel, groupTransactionsByDay } from '../../utils/transactions'

export default function TransactionList({ transactions, userEmail }) {
  if (!transactions.length) {
    return (
      <div className="rounded-2xl border border-border-hairline bg-surface p-8 text-center">
        <p className="font-body text-text-muted">
          No transactions yet —{' '}
          <Link to="/send" className="focus-ring text-accent-gold hover:underline">
            send your first transfer
          </Link>
        </p>
      </div>
    )
  }

  const groups = groupTransactionsByDay(transactions)

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.dayKey}>
          <h3 className="mb-3 font-body text-xs font-medium uppercase tracking-wider text-text-muted">
            {group.label}
          </h3>
          <ul className="space-y-2">
            {group.items.map((tx) => {
              const isTopUp = tx.category === 'TOPUP'
              const isCredit =
                tx.receiverEmail === userEmail &&
                (tx.senderEmail !== userEmail || isTopUp)
              const signedAmount = isCredit ? '+' : '−'

              return (
                <li
                  key={tx.id}
                  className="flex items-center justify-between rounded-xl border border-border-hairline bg-surface px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-body text-sm font-medium text-text-primary">
                        {getTransactionLabel(tx, userEmail)}
                      </p>
                      <CategoryTag category={tx.category} />
                    </div>
                  </div>
                  <p
                    className={`ml-4 shrink-0 font-heading text-sm font-semibold tabular-nums ${
                      isCredit ? 'text-positive' : 'text-negative'
                    }`}
                  >
                    {signedAmount}
                    {formatCurrency(tx.amount)}
                  </p>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
