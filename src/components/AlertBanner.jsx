const styles = {
  error: 'border-negative/35 bg-negative/10 text-negative',
  success: 'border-positive/35 bg-positive/10 text-positive',
  info: 'border-border-hairline bg-elevated text-text-muted',
}

export default function AlertBanner({ tone = 'error', children, className = '' }) {
  return (
    <p
      role="alert"
      className={`rounded-control border px-4 py-3 font-body text-sm leading-relaxed ${styles[tone]} ${className}`}
    >
      {children}
    </p>
  )
}
