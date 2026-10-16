import { Link } from 'react-router-dom'
import CategoryTag from './CategoryTag'
import { IconSend } from '../icons'
import { formatCurrency } from '../../utils/format'
import { getTransactionLabel, groupTransactionsByDay } from '../../utils/transactions'

export default function TransactionList({ transactions, userEmail, compact = false }) {
  if (!transactions.length) {
    return (
      <div className="rounded-panel border border-dashed border-border-strong bg-ink/40 px-6 py-12 text-center">
        <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full border border-border-hairline bg-elevated text-accent-gold">
          <IconSend className="h-5 w-5" />
        </div>
        <p className="font-heading text-base font-semibold text-text-primary">No transactions yet</p>
        <p className="mt-2 font-body text-sm text-text-muted">
          <Link to="/send" className="focus-ring text-accent-gold hover:underline">
            Send your first transfer
          </Link>{' '}
          to see activity here.
        </p>
      </div>
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
        <section key={group.dayKey}>
          <h3 className="section-label mb-3">{group.label}</h3>
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
      <p className={`shrink-0 font-heading text-sm font-semibold tabular-nums ${amountClass}`}>
        {signedAmount}
        {formatCurrency(tx.amount)}
      </p>
    </li>
  )
}
