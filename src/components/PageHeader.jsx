export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="section-label mb-2">{eyebrow}</p>}
        <h1 className="font-heading text-display-sm text-text-primary md:text-[2.25rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-xl font-body text-sm leading-relaxed text-text-muted">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}
