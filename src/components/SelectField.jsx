export default function SelectField({
  id,
  label,
  value,
  onChange,
  children,
  className = '',
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block font-body text-sm font-medium text-text-muted">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`focus-ring field-control ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}
