import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useClearServerState } from '../hooks/useWallet'
import BrandMark from './BrandMark'
import {
  IconActivity,
  IconAdd,
  IconHome,
  IconRequest,
  IconSend,
  IconSignOut,
} from './icons'

const navItems = [
  { to: '/dashboard', label: 'Home', end: true, icon: IconHome },
  { to: '/transactions', label: 'Activity', icon: IconActivity },
  { to: '/send', label: 'Send', icon: IconSend },
  { to: '/add', label: 'Add', icon: IconAdd },
  { to: '/request', label: 'Request', icon: IconRequest },
]

function NavItem({ to, label, end, icon: Icon, compact = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          'focus-ring group flex items-center transition-colors',
          compact
            ? 'flex-col gap-1 px-2 py-2 text-[0.65rem] font-medium'
            : 'gap-3 rounded-control px-3 py-2.5 text-sm font-medium',
          isActive
            ? compact
              ? 'text-accent-gold'
              : 'bg-accent-gold-muted text-accent-gold'
            : 'text-text-muted hover:text-text-primary',
        ].join(' ')
      }
    >
      <Icon className={compact ? 'h-[18px] w-[18px]' : 'h-5 w-5 shrink-0'} />
      <span>{label}</span>
    </NavLink>
  )
}

export default function AppLayout() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuth()
  const clearServerState = useClearServerState()

  function handleSignOut() {
    clearAuth()
    clearServerState()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell flex min-h-dvh">
      <aside className="relative z-10 hidden w-60 shrink-0 flex-col border-r border-border-hairline bg-ink/80 px-5 py-6 backdrop-blur-sm lg:flex">
        <BrandMark />
        <nav aria-label="Main" className="mt-10 flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
        <div className="border-t border-border-hairline pt-4">
          <p className="truncate font-heading text-sm font-semibold text-text-primary">
            {user?.name}
          </p>
          <p className="mt-0.5 truncate font-body text-xs text-text-faint">{user?.email}</p>
          <button
            type="button"
            onClick={handleSignOut}
            className="focus-ring mt-3 inline-flex items-center gap-2 font-body text-xs text-text-muted hover:text-accent-gold"
          >
            <IconSignOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border-hairline bg-ink/70 px-4 py-3.5 backdrop-blur-sm lg:hidden">
          <BrandMark size="sm" />
          <button
            type="button"
            onClick={handleSignOut}
            className="focus-ring inline-flex items-center gap-1.5 font-body text-xs text-text-muted hover:text-accent-gold"
          >
            <IconSignOut className="h-4 w-4" />
            Sign out
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 sm:px-6 md:px-8 md:py-8 lg:pb-10">
          <Outlet />
        </main>

        <nav
          aria-label="Main"
          className="fixed inset-x-0 bottom-0 z-20 border-t border-border-hairline bg-ink/95 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-md lg:hidden"
        >
          <div className="mx-auto flex max-w-lg items-stretch justify-between">
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} compact />
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
