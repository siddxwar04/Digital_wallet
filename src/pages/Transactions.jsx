import { useState } from 'react'
import { getErrorMessage } from '../api/errors'
import CategoryChart from '../components/insights/CategoryChart'
import TransactionFilters from '../components/transactions/TransactionFilters'
import TransactionList from '../components/transactions/TransactionList'
import TransactionSkeleton from '../components/transactions/TransactionSkeleton'
import { useAuth } from '../hooks/useAuth'
import { useInsightsSummary } from '../hooks/useInsights'
import { useTransactions } from '../hooks/useTransactions'
import { formatCurrency } from '../utils/format'
import {
  currentMonthKey,
  toIsoEndOfDay,
  toIsoStartOfDay,
} from '../utils/transactions'

const PAGE_SIZE = 10

export default function Transactions() {
  const { user } = useAuth()
  const [page, setPage] = useState(0)
  const [category, setCategory] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [summaryMonth, setSummaryMonth] = useState(currentMonthKey())

  const from = toIsoStartOfDay(fromDate)
  const to = toIsoEndOfDay(toDate)

  const {
    data: txData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useTransactions({
    page,
    size: PAGE_SIZE,
    category,
    from,
    to,
  })

  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
    error: summaryErr,
  } = useInsightsSummary(summaryMonth)

  function resetPage() {
    setPage(0)
  }

  function handleCategoryChange(value) {
    setCategory(value)
    resetPage()
  }

  function handleFromDateChange(value) {
    setFromDate(value)
    resetPage()
  }

  function handleToDateChange(value) {
    setToDate(value)
    resetPage()
  }

  function clearFilters() {
    setCategory('')
    setFromDate('')
    setToDate('')
    resetPage()
  }

  const transactions = txData?.content ?? []
  const totalPages = txData?.totalPages ?? 0
  const showEmpty = !isLoading && transactions.length === 0

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h2 className="font-heading text-2xl font-bold text-text-primary">Transactions</h2>
        <p className="mt-1 font-body text-sm text-text-muted">Activity and spending insights</p>
      </header>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="font-heading text-lg font-semibold text-text-primary">Insights</h3>
            <p className="font-body text-sm text-text-muted">Spending by category</p>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="summary-month" className="block font-body text-xs text-text-muted">
              Month
            </label>
            <input
              id="summary-month"
              type="month"
              value={summaryMonth}
              onChange={(e) => setSummaryMonth(e.target.value)}
              className="focus-ring rounded-xl border border-border-hairline bg-surface px-3 py-2 font-body text-sm text-text-primary focus:border-accent-gold/50"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border-hairline bg-surface p-5">
          {summaryError ? (
            <p className="font-body text-sm text-negative" role="alert">
              {getErrorMessage(summaryErr, 'Could not load insights')}
            </p>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <p className="font-body text-sm text-text-muted">Total spent</p>
                <p className="font-heading text-xl font-bold tabular-nums text-text-primary">
                  {summaryLoading ? '…' : formatCurrency(summary?.totalSpent ?? 0)}
                </p>
                {!summaryLoading && (
                  <p className="font-body text-xs text-text-muted">
                    {summary?.transactionCount ?? 0} outgoing transactions
                  </p>
                )}
              </div>
              <CategoryChart categories={summary?.categories ?? []} loading={summaryLoading} />
            </>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-heading text-lg font-semibold text-text-primary">Activity</h3>

        <TransactionFilters
          category={category}
          fromDate={fromDate}
          toDate={toDate}
          onCategoryChange={handleCategoryChange}
          onFromDateChange={handleFromDateChange}
          onToDateChange={handleToDateChange}
          onClear={clearFilters}
        />

        {isError ? (
          <div className="rounded-2xl border border-negative/30 bg-surface p-6">
            <p className="font-body text-sm text-negative" role="alert">
              {getErrorMessage(error, 'Could not load transactions')}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="focus-ring mt-3 font-body text-sm text-accent-gold hover:underline"
            >
              Try again
            </button>
          </div>
        ) : isLoading ? (
          <TransactionSkeleton />
        ) : showEmpty ? (
          <TransactionList transactions={[]} userEmail={user?.email} />
        ) : (
          <>
            <TransactionList transactions={transactions} userEmail={user?.email} />

            {totalPages > 1 && (
              <div className="flex items-center justify-between rounded-xl border border-border-hairline bg-surface px-4 py-3">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0 || isFetching}
                  className="focus-ring font-body text-sm text-accent-gold disabled:opacity-40"
                >
                  Previous
                </button>
                <p className="font-body text-sm text-text-muted">
                  Page {page + 1} of {totalPages}
                  {isFetching && !isLoading ? ' · Updating…' : ''}
                </p>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={txData?.last || page + 1 >= totalPages || isFetching}
                  className="focus-ring font-body text-sm text-accent-gold disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
