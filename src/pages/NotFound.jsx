import { Link } from 'react-router-dom'
import ActionButton from '../components/ActionButton'
import BrandMark from '../components/BrandMark'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <BrandMark size="lg" />
      <h1 className="mt-10 font-heading text-3xl font-bold text-text-primary">Page not found</h1>
      <p className="mt-3 max-w-sm text-center font-body text-sm text-text-muted">
        That route does not exist. Head back to your wallet dashboard.
      </p>
      <div className="mt-8">
        <ActionButton to="/dashboard">Go to dashboard</ActionButton>
      </div>
      <p className="mt-6 font-body text-sm text-text-faint">
        Or{' '}
        <Link to="/login" className="focus-ring text-accent-gold hover:underline">
          sign in
        </Link>
      </p>
    </div>
  )
}
