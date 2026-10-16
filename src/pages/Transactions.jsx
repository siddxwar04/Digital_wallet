import { useState } from 'react'
import { getErrorMessage } from '../api/errors'
import AlertBanner from '../components/AlertBanner'
import ErrorPanel from '../components/ErrorPanel'
import PageHeader from '../components/PageHeader'
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
  const hasFilters = Boolean(category || fromDate || toDate)

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
    <div className="page-stack mx-auto max-w-wide">
      <PageHeader
        eyebrow="Ledger"
        title="Activity"
        description="Spending insights and your full transaction history."
      />

      <section className="space-y-4" aria-labelledby="insights-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="insights-heading" className="font-heading text-lg font-semibold text-text-primary">
              Insights
            </h2>
            <p className="mt-1 font-body text-sm text-text-muted">Outgoing spend by category</p>
          </div>
          <div className="space-y-2">
            <label htmlFor="summary-month" className="block font-body text-xs font-medium text-text-muted">
              Month
            </label>
            <input
              id="summary-month"
              type="month"
              value={summaryMonth}
              onChange={(e) => setSummaryMonth(e.target.value)}
              className="focus-ring field-control w-full sm:w-auto"
            />
          </div>
        </div>

        <div className="rounded-panel border border-border-hairline bg-surface p-5 sm:p-6">
          {summaryError ? (
            <AlertBanner>{getErrorMessage(summaryErr, 'Could not load insights')}</AlertBanner>
          ) : (
            <>
              <div className="mb-5 flex flex-wrap items-end gap-x-6 gap-y-2 border-b border-border-hairline pb-5">
                <div>
                  <p className="section-label mb-1">Total spent</p>
                  {summaryLoading ? (
                    <div
                      className="mt-1 h-8 w-28 animate-pulse rounded-control bg-elevated"
                      aria-hidden="true"
                    />
                  ) : (
                    <p className="font-heading text-2xl font-bold tabular-nums text-text-primary">
                      {formatCurrency(summary?.totalSpent ?? 0)}
                    </p>
                  )}
                </div>
                {!summaryLoading && (
                  <p className="pb-1 font-body text-sm text-text-muted">
                    {summary?.transactionCount ?? 0} outgoing transactions
                  </p>
                )}
              </div>
              <CategoryChart categories={summary?.categories ?? []} loading={summaryLoading} />
            </>
          )}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="history-heading">
        <h2 id="history-heading" className="font-heading text-lg font-semibold text-text-primary">
          History
        </h2>

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
          <ErrorPanel
            message={getErrorMessage(error, 'Could not load transactions')}
            onRetry={() => refetch()}
          />
        ) : isLoading ? (
          <TransactionSkeleton />
        ) : showEmpty ? (
          <TransactionList
            transactions={[]}
            userEmail={user?.email}
            filtered={hasFilters}
            onClearFilters={hasFilters ? clearFilters : undefined}
          />
        ) : (
          <>
            <TransactionList transactions={transactions} userEmail={user?.email} />

            {totalPages > 1 && (
              <nav
                aria-label="Transaction pages"
                className="flex items-center justify-between gap-4 border-t border-border-hairline pt-4"
              >
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0 || isFetching}
                  className="focus-ring font-body text-sm text-accent-gold disabled:opacity-40"
                >
                  Previous
                </button>
                <p className="font-body text-sm text-text-muted" aria-live="polite">
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
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  )
}
