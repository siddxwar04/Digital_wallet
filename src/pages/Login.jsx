import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { getErrorMessage } from '../api/errors'
import AlertBanner from '../components/AlertBanner'
import AuthCard from '../components/AuthCard'
import FormField from '../components/FormField'
import SubmitButton from '../components/SubmitButton'
import TextInput from '../components/TextInput'
import { useAuth } from '../hooks/useAuth'
import { toSessionUser } from '../utils/authSession'
import { validateEmail, validateLoginPassword } from '../utils/validation'

export default function Login() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const errors = {}
    const emailError = validateEmail(email)
    const passwordError = validateLoginPassword(password)
    if (emailError) errors.email = emailError
    if (passwordError) errors.password = passwordError

    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setLoading(true)

    try {
      const data = await login(email.trim(), password)
      setAuth(data.token, toSessionUser(data))
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid email or password'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Sign in" subtitle="Welcome back — access your balance and transfers.">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && <AlertBanner>{error}</AlertBanner>}

        <FormField label="Email" id="email" error={fieldErrors.email}>
          <TextInput
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
          />
        </FormField>

        <FormField label="Password" id="password" error={fieldErrors.password}>
          <TextInput
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? 'password-error' : undefined}
          />
        </FormField>

        <SubmitButton loading={loading}>Sign in</SubmitButton>
      </form>

      <p className="mt-6 text-center font-body text-sm text-text-muted">
        No account?{' '}
        <Link to="/register" className="focus-ring font-medium text-accent-gold hover:underline">
          Create one
        </Link>
      </p>
    </AuthCard>
  )
}
