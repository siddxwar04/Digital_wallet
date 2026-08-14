export default function SubmitButton({ children, loading, disabled, ...props }) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className="focus-ring inline-flex w-full items-center justify-center rounded-xl bg-accent-gold px-5 py-3 font-body text-sm font-semibold text-canvas transition-transform active:scale-[0.97] hover:bg-accent-gold-hover disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    >
      {loading ? 'Please wait…' : children}
    </button>
  )
}
