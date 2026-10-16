import AlertBanner from './AlertBanner'

export default function ErrorPanel({
  message,
  onRetry,
  retryLabel = 'Try again',
  className = '',
}) {
  return (
    <div
      className={`rounded-panel border border-negative/30 bg-surface p-6 ${className}`}
    >
      <AlertBanner>{message}</AlertBanner>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="focus-ring mt-4 font-body text-sm text-accent-gold hover:underline"
        >
          {retryLabel}
        </button>
      )}
    </div>
  )
}
