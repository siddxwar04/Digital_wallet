export default function BrandMark({ size = 'md', showWordmark = true }) {
  const glyph =
    size === 'lg'
      ? 'h-10 w-10 text-sm rounded-lg'
      : size === 'sm'
        ? 'h-7 w-7 text-[0.65rem] rounded-md'
        : 'h-8 w-8 text-xs rounded-md'

  const word =
    size === 'lg'
      ? 'text-2xl'
      : size === 'sm'
        ? 'text-base'
        : 'text-lg'

  return (
    <span className="brand-mark">
      <span className={`brand-mark__glyph ${glyph}`} aria-hidden="true">
        W
      </span>
      {showWordmark && (
        <span className={`font-heading font-bold tracking-tight text-text-primary ${word}`}>
          Wallet
        </span>
      )}
    </span>
  )
}
