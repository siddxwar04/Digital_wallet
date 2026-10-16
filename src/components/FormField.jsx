export default function FormField({ label, id, error, children }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block font-body text-sm font-medium text-text-muted">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="font-body text-sm text-negative" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
