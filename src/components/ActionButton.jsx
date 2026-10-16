import { Link } from 'react-router-dom'

export default function ActionButton({
  children,
  to,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}) {
  const base =
    'focus-ring inline-flex items-center justify-center gap-2 rounded-control px-5 py-3.5 text-sm font-medium transition-[transform,background-color,border-color] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50'

  const variants = {
    primary: 'bg-accent-gold font-semibold text-canvas hover:bg-accent-gold-hover',
    secondary:
      'border border-border-strong bg-elevated text-text-primary hover:border-accent-gold/40',
    ghost: 'text-text-muted hover:text-accent-gold',
  }

  const classes = `${base} ${variants[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}
