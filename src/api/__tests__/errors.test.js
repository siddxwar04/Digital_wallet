import { describe, expect, it } from 'vitest'
import { getErrorMessage } from '../errors'

describe('getErrorMessage', () => {
  it('prefers the API message when present', () => {
    expect(
      getErrorMessage({ response: { data: { message: 'Insufficient balance' } } }, 'fallback'),
    ).toBe('Insufficient balance')
  })

  it('explains network failures', () => {
    expect(getErrorMessage({ code: 'ERR_NETWORK' }, 'fallback')).toBe(
      'Cannot reach the server — check that the API is running',
    )
  })

  it('uses the fallback when nothing useful is available', () => {
    expect(getErrorMessage({}, 'Something went wrong')).toBe('Something went wrong')
  })
})
