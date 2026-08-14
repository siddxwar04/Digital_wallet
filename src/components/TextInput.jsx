export default function TextInput({ id, className = '', ...props }) {
  return (
    <input
      id={id}
      className={`focus-ring w-full rounded-xl border border-border-hairline bg-canvas px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-accent-gold/50 disabled:opacity-60 ${className}`}
      {...props}
    />
  )
}
