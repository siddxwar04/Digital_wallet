import ActionButton from './ActionButton'
import { IconCheck } from './icons'

export default function SuccessPanel({
  title,
  description,
  primaryAction,
  secondaryAction,
}) {
  return (
    <div className="mx-auto max-w-lg" role="status" aria-live="polite">
      <div className="rounded-hero border border-positive/30 bg-surface px-6 py-10 text-center sm:px-8">
        <div
          className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-positive/15 text-positive"
          aria-hidden="true"
        >
          <IconCheck className="h-6 w-6" />
        </div>
        <p className="font-heading text-xl font-semibold text-text-primary sm:text-2xl">{title}</p>
        {description && (
          <p className="mt-2 font-body text-sm text-text-muted">{description}</p>
        )}
        {(primaryAction || secondaryAction) && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {primaryAction && (
              <ActionButton
                to={primaryAction.to}
                onClick={primaryAction.onClick}
                className="w-full sm:w-auto"
              >
                {primaryAction.label}
              </ActionButton>
            )}
            {secondaryAction && (
              <ActionButton
                variant="secondary"
                to={secondaryAction.to}
                onClick={secondaryAction.onClick}
                className="w-full sm:w-auto"
              >
                {secondaryAction.label}
              </ActionButton>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
