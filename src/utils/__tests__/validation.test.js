import { describe, expect, it } from 'vitest'
import {
  validateEmail,
  validateLoginPassword,
  validateNewPassword,
  validatePositiveAmount,
} from '../validation'

describe('validation helpers', () => {
  it('accepts a normal email and rejects empty or malformed values', () => {
    expect(validateEmail('rahul@example.com')).toBe('')
    expect(validateEmail('')).toBe('Enter your email address')
    expect(validateEmail('not-an-email')).toBe('Enter a valid email address')
  })

  it('requires a login password', () => {
    expect(validateLoginPassword('')).toBe('Enter your password')
    expect(validateLoginPassword('secret')).toBe('')
  })

  it('enforces minimum length for new passwords', () => {
    expect(validateNewPassword('12345')).toBe('Password must be at least 6 characters')
    expect(validateNewPassword('123456')).toBe('')
  })

  it('requires a positive amount', () => {
    expect(validatePositiveAmount('')).toBe('Enter an amount')
    expect(validatePositiveAmount('0')).toBe('Enter an amount greater than zero')
    expect(validatePositiveAmount('-5')).toBe('Enter an amount greater than zero')
    expect(validatePositiveAmount('250')).toBe('')
  })
})
