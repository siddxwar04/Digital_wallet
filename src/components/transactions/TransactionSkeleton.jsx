export default function TransactionSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-24 rounded bg-border-hairline" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-border-hairline bg-surface px-4 py-3"
            >
              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-border-hairline" />
                <div className="h-3 w-20 rounded bg-border-hairline" />
              </div>
              <div className="h-4 w-16 rounded bg-border-hairline" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
