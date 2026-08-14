import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import { getErrorMessage } from '../api/errors'
import AuthCard from '../components/AuthCard'
import FormField from '../components/FormField'
import SubmitButton from '../components/SubmitButton'
import TextInput from '../components/TextInput'
import { useAuth } from '../hooks/useAuth'
import { validateEmail, validateName, validateNewPassword } from '../utils/validation'

export default function Register() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const errors = {}
    const nameError = validateName(name)
    const emailError = validateEmail(email)
    const passwordError = validateNewPassword(password)
    if (nameError) errors.name = nameError
    if (emailError) errors.email = emailError
    if (passwordError) errors.password = passwordError

    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setLoading(true)

    try {
      const data = await register(name.trim(), email.trim(), password)
      setAuth(data.token, {
        id: data.userId,
        name: data.name,
        email: data.email,
      })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create account'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Create account" subtitle="Set up your digital wallet">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <p
            className="rounded-xl border border-negative/30 bg-negative/10 px-4 py-3 font-body text-sm text-negative"
            role="alert"
          >
            {error}
          </p>
        )}

        <FormField label="Name" id="name" error={fieldErrors.name}>
          <TextInput
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? 'name-error' : undefined}
          />
        </FormField>

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
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? 'password-error' : undefined}
          />
        </FormField>

        <SubmitButton loading={loading}>Create account</SubmitButton>
      </form>

      <p className="mt-4 text-center font-body text-sm text-text-muted">
        Already have an account?{' '}
        <Link to="/login" className="focus-ring text-accent-gold hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  )
}
