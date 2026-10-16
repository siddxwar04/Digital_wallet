import { Link } from 'react-router-dom'

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div
      className={`rounded-panel border border-dashed border-border-strong bg-ink/40 px-6 py-12 text-center ${className}`}
      role="status"
    >
      {Icon && (
        <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full border border-border-hairline bg-elevated text-accent-gold">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <p className="font-heading text-base font-semibold text-text-primary">{title}</p>
      {description && (
        <p className="mx-auto mt-2 max-w-sm font-body text-sm leading-relaxed text-text-muted">
          {description}
        </p>
      )}
      {action?.to && (
        <p className="mt-4">
          <Link
            to={action.to}
            onClick={action.onClick}
            className="focus-ring font-body text-sm font-medium text-accent-gold hover:underline"
          >
            {action.label}
          </Link>
        </p>
      )}
      {action && !action.to && action.onClick && (
        <button
          type="button"
          onClick={action.onClick}
          className="focus-ring mt-4 font-body text-sm font-medium text-accent-gold hover:underline"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
