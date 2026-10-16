import { Link } from 'react-router-dom'
import BalanceCard from '../components/BalanceCard'
import ErrorPanel from '../components/ErrorPanel'
import PageHeader from '../components/PageHeader'
import TransactionList from '../components/transactions/TransactionList'
import TransactionSkeleton from '../components/transactions/TransactionSkeleton'
import { IconAdd, IconRequest, IconSend } from '../components/icons'
import { useAuth } from '../hooks/useAuth'
import { useWallet } from '../hooks/useWallet'
import { getErrorMessage } from '../api/errors'

const quickActions = [
  {
    to: '/send',
    label: 'Send',
    hint: 'Pay someone',
    icon: IconSend,
    primary: true,
  },
  {
    to: '/add',
    label: 'Add money',
    hint: 'Top up wallet',
    icon: IconAdd,
    primary: false,
  },
  {
    to: '/request',
    label: 'Request',
    hint: 'Create a pending ask',
    icon: IconRequest,
    primary: false,
  },
]

export default function Dashboard() {
  const { user } = useAuth()
  const { data, isLoading, isError, error, refetch, isFetching } = useWallet()
  const recent = data?.recentTransactions ?? []

  return (
    <div className="page-stack mx-auto max-w-content">
      <PageHeader
        eyebrow="Overview"
        title={`Hi, ${user?.name || 'there'}`}
        description="Your balance, quick actions, and latest activity."
      />

      {isError ? (
        <ErrorPanel
          message={getErrorMessage(error, 'Could not load balance')}
          onRetry={() => refetch()}
        />
      ) : (
        <BalanceCard
          balance={data?.balance ?? 0}
          currency={data?.currency}
          loading={isLoading}
        />
      )}

      <section aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="section-label mb-3">
          Quick actions
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {quickActions.map(({ to, label, hint, icon: Icon, primary }) => (
            <Link
              key={to}
              to={to}
              className={`focus-ring flex min-h-[7rem] flex-col items-start gap-3 rounded-panel border px-4 py-4 transition-[transform,border-color,background-color] active:scale-[0.97] ${
                primary
                  ? 'border-accent-gold/40 bg-accent-gold text-canvas hover:bg-accent-gold-hover'
                  : 'border-border-strong bg-elevated text-text-primary hover:border-accent-gold/40'
              }`}
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-control ${
                  primary ? 'bg-canvas/15 text-canvas' : 'bg-accent-gold-muted text-accent-gold'
                }`}
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-heading text-base font-semibold">{label}</span>
                <span
                  className={`mt-0.5 block font-body text-xs ${
                    primary ? 'text-canvas/75' : 'text-text-muted'
                  }`}
                >
                  {hint}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="recent-activity-heading">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="recent-activity-heading" className="section-label">
            Recent activity
          </h2>
          <Link
            to="/transactions"
            className="focus-ring font-body text-xs font-medium text-accent-gold hover:underline"
          >
            View all
          </Link>
        </div>
        {isError ? null : isLoading ? (
          <TransactionSkeleton />
        ) : (
          <TransactionList
            transactions={recent}
            userEmail={user?.email ?? data?.email}
            compact
          />
        )}
        {isFetching && !isLoading && (
          <p className="font-body text-xs text-text-faint" aria-live="polite">
            Updating balance…
          </p>
        )}
      </section>
    </div>
  )
}
