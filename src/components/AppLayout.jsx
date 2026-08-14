import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  { to: '/dashboard', label: 'Home', end: true },
  { to: '/transactions', label: 'Activity' },
  { to: '/send', label: 'Send' },
  { to: '/add', label: 'Add' },
  { to: '/request', label: 'Request' },
]

function NavItem({ to, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `focus-ring flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors md:flex-row md:gap-3 md:rounded-xl md:px-4 md:py-3 md:text-sm ${
          isActive
            ? 'text-accent-gold md:border md:border-accent-gold/30 md:bg-surface'
            : 'text-text-muted hover:text-text-primary'
        }`
      }
    >
      <span>{label}</span>
    </NavLink>
  )
}

export default function AppLayout() {
  const { user, clearAuth } = useAuth()

  return (
    <div className="flex min-h-dvh bg-canvas">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border-hairline p-6 md:flex">
        <h1 className="font-heading mb-8 text-lg font-bold text-text-primary">Wallet</h1>
        <nav aria-label="Main" className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
        <div className="border-t border-border-hairline pt-4">
          <p className="truncate font-body text-sm text-text-primary">{user?.name}</p>
          <button
            type="button"
            onClick={clearAuth}
            className="focus-ring mt-2 font-body text-xs text-text-muted hover:text-accent-gold"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border-hairline px-4 py-4 md:hidden">
          <h1 className="font-heading text-base font-bold text-text-primary">Wallet</h1>
          <button
            type="button"
            onClick={clearAuth}
            className="focus-ring font-body text-xs text-text-muted hover:text-accent-gold"
          >
            Sign out
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 md:px-8 md:pb-8 md:pt-8">
          <Outlet />
        </main>

        <nav
          aria-label="Main"
          className="fixed inset-x-0 bottom-0 flex items-center justify-around border-t border-border-hairline bg-surface px-2 py-2 md:hidden"
        >
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
      </div>
    </div>
  )
}
