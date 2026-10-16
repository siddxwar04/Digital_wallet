import BrandMark from './BrandMark'

export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="relative flex min-h-dvh items-stretch justify-center px-4 py-8 md:px-8 md:py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-hero border border-border-hairline bg-ink shadow-glow md:grid-cols-[1.05fr_1fr]">
        <aside className="relative hidden flex-col justify-between border-b border-border-hairline p-8 md:flex md:border-b-0 md:border-r md:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(ellipse 80% 70% at 20% 20%, rgba(201,162,75,0.16), transparent 55%)',
            }}
          />
          <BrandMark size="lg" />
          <div className="relative mt-16 max-w-sm">
            <p className="section-label mb-3">Digital wallet</p>
            <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-text-primary lg:text-4xl">
              Money that stays clear and accountable.
            </h2>
            <p className="mt-4 font-body text-sm leading-relaxed text-text-muted">
              Send, top up, and track spending with category insights — built for everyday use, not
              dashboard clutter.
            </p>
          </div>
          <p className="relative mt-12 font-body text-xs text-text-faint">
            Secure JWT sessions · Postgres-backed balances
          </p>
        </aside>

        <div className="flex flex-col justify-center bg-surface p-6 sm:p-8 md:p-10">
          <div className="mb-8 md:hidden">
            <BrandMark />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 font-body text-sm leading-relaxed text-text-muted">{subtitle}</p>
          )}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
