export default function TransactionSkeleton() {
  return (
    <div
      className="space-y-8 animate-pulse"
      role="status"
      aria-label="Loading transactions"
    >
      <div>
        <div className="mb-3 h-3 w-20 rounded bg-elevated" />
        <div className="divider-list rounded-panel border border-border-hairline bg-surface">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4">
              <div className="space-y-2">
                <div className="h-4 w-44 rounded bg-elevated" />
                <div className="h-3 w-16 rounded bg-elevated" />
              </div>
              <div className="h-4 w-16 rounded bg-elevated" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading transactions</span>
    </div>
  )
}
