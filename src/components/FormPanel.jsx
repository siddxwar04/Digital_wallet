export default function FormPanel({ children, onSubmit, className = '' }) {
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={`space-y-5 rounded-panel border border-border-hairline bg-surface p-5 sm:p-6 ${className}`}
    >
      {children}
    </form>
  )
}
