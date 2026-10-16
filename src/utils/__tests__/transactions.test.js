import { describe, expect, it } from 'vitest'
import { getTransactionLabel, groupTransactionsByDay } from '../transactions'

describe('transaction helpers', () => {
  it('labels top-ups, transfers, and pending requests from each side', () => {
    expect(
      getTransactionLabel(
        {
          category: 'TOPUP',
          senderEmail: 'me@test.com',
          receiverEmail: 'me@test.com',
        },
        'me@test.com',
      ),
    ).toBe('Added to wallet')

    expect(
      getTransactionLabel(
        {
          category: 'TRANSFER',
          senderEmail: 'me@test.com',
          receiverEmail: 'you@test.com',
        },
        'me@test.com',
      ),
    ).toBe('Sent to you@test.com')

    expect(
      getTransactionLabel(
        {
          category: 'REQUEST',
          senderEmail: 'payer@test.com',
          receiverEmail: 'me@test.com',
        },
        'me@test.com',
      ),
    ).toBe('Requested from payer@test.com')

    expect(
      getTransactionLabel(
        {
          category: 'REQUEST',
          senderEmail: 'me@test.com',
          receiverEmail: 'requester@test.com',
        },
        'me@test.com',
      ),
    ).toBe('Request from requester@test.com')
  })

  it('groups transactions by calendar day', () => {
    const groups = groupTransactionsByDay([
      { id: 1, timestamp: '2026-10-16T10:00:00.000Z' },
      { id: 2, timestamp: '2026-10-16T18:00:00.000Z' },
      { id: 3, timestamp: '2026-10-15T12:00:00.000Z' },
    ])

    expect(groups).toHaveLength(2)
    expect(groups[0].items.map((tx) => tx.id)).toEqual([1, 2])
    expect(groups[1].items.map((tx) => tx.id)).toEqual([3])
  })
})
