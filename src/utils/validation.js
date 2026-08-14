const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const MIN_PASSWORD_LENGTH = 6

export function validateEmail(value) {
  const trimmed = value.trim()
  if (!trimmed) return 'Enter your email address'
  if (!EMAIL_PATTERN.test(trimmed)) return 'Enter a valid email address'
  return ''
}

export function validateLoginPassword(value) {
  if (!value) return 'Enter your password'
  return ''
}

export function validateNewPassword(value) {
  if (!value) return 'Enter a password'
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
  }
  return ''
}

export function validateName(value) {
  if (!value.trim()) return 'Enter your name'
  return ''
}
