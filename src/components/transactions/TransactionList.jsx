import EmptyState from '../EmptyState'
import CategoryTag from './CategoryTag'
import { IconSend } from '../icons'
import { formatCurrency } from '../../utils/format'
import { getTransactionLabel, groupTransactionsByDay } from '../../utils/transactions'

export default function TransactionList({
  transactions,
  userEmail,
  compact = false,
  filtered = false,
  onClearFilters,
}) {
  if (!transactions.length) {
    if (filtered) {
      return (
        <EmptyState
          icon={IconSend}
          title="No matching activity"
          description="Nothing matches these filters. Clear them to see your full history."
          action={
            onClearFilters
              ? { label: 'Clear filters', onClick: onClearFilters }
              : undefined
          }
        />
      )
    }

    return (
      <EmptyState
        icon={IconSend}
        title="No transactions yet"
        description="Top up your wallet or send money to see activity here."
        action={{ to: '/add', label: 'Add money' }}
      />
    )
  }

  if (compact) {
    return (
      <ul className="divider-list rounded-panel border border-border-hairline bg-surface">
        {transactions.slice(0, 5).map((tx) => (
          <TransactionRow key={tx.id} tx={tx} userEmail={userEmail} />
        ))}
      </ul>
    )
  }

  const groups = groupTransactionsByDay(transactions)

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.dayKey} aria-labelledby={`day-${group.dayKey}`}>
          <h3 id={`day-${group.dayKey}`} className="section-label mb-3">
            {group.label}
          </h3>
          <ul className="divider-list rounded-panel border border-border-hairline bg-surface">
            {group.items.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} userEmail={userEmail} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function TransactionRow({ tx, userEmail }) {
  const isPending = tx.status === 'PENDING'
  const isTopUp = tx.category === 'TOPUP'
  const isCredit =
    !isPending &&
    tx.receiverEmail === userEmail &&
    (tx.senderEmail !== userEmail || isTopUp)

  let amountClass = 'text-text-primary'
  let signedAmount = ''

  if (isPending) {
    amountClass = 'text-text-muted'
  } else if (isCredit) {
    amountClass = 'text-positive'
    signedAmount = '+'
  } else {
    amountClass = 'text-negative'
    signedAmount = '−'
  }

  return (
    <li className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-body text-sm font-medium text-text-primary">
            {getTransactionLabel(tx, userEmail)}
          </p>
          <CategoryTag category={tx.category} />
          {isPending && (
            <span className="rounded-full border border-border-hairline bg-ink px-2 py-0.5 text-[11px] font-medium text-text-muted">
              Pending
            </span>
          )}
        </div>
      </div>
      <p
        className={`shrink-0 font-heading text-sm font-semibold tabular-nums ${amountClass}`}
        aria-label={`${isPending ? 'Pending ' : ''}${signedAmount}${formatCurrency(tx.amount)}`}
      >
        {signedAmount}
        {formatCurrency(tx.amount)}
      </p>
    </li>
  )
}
