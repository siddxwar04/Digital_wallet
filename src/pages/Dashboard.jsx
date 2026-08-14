import ActionButton from '../components/ActionButton'
import BalanceCard from '../components/BalanceCard'
import { useAuth } from '../hooks/useAuth'
import { useWallet } from '../hooks/useWallet'
import { getErrorMessage } from '../api/errors'

export default function Dashboard() {
  const { user } = useAuth()
  const { data, isLoading, isError, error, refetch, isFetching } = useWallet()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-text-primary">
          Hi, {user?.name || 'there'}
        </h2>
        <p className="mt-1 font-body text-sm text-text-muted">Your wallet overview</p>
      </div>

      {isError ? (
        <div className="rounded-2xl border border-negative/30 bg-surface p-6">
          <p className="font-body text-sm text-negative" role="alert">
            {getErrorMessage(error, 'Could not load balance')}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="focus-ring mt-3 font-body text-sm text-accent-gold hover:underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <BalanceCard
          balance={data?.balance ?? 0}
          currency={data?.currency}
          loading={isLoading}
        />
      )}

      <div className="grid grid-cols-3 gap-3">
        <ActionButton to="/send" className="w-full">
          Send
        </ActionButton>
        <ActionButton to="/add" variant="secondary" className="w-full">
          Add Money
        </ActionButton>
        <ActionButton to="/request" variant="secondary" className="w-full">
          Request
        </ActionButton>
      </div>

      {isFetching && !isLoading && (
        <p className="font-body text-xs text-text-muted">Updating balance…</p>
      )}
    </div>
  )
}
