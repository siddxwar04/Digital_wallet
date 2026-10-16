export const TRANSACTION_CATEGORIES = [
  'TRANSFER',
  'TOPUP',
  'FOOD',
  'TRANSPORT',
  'SHOPPING',
  'BILLS',
  'REQUEST',
]

export const CHART_COLORS = {
  FOOD: '#C9A24B',
  TRANSPORT: '#5ECF8E',
  SHOPPING: '#E87B7B',
  BILLS: '#8E919C',
  TRANSFERS: '#D8B45C',
  OTHER: '#6A6D78',
}

export const CATEGORY_STYLES = {
  TRANSFER: { label: 'Transfer', color: 'text-accent-gold', bg: 'bg-accent-gold-muted' },
  TOPUP: { label: 'Top up', color: 'text-positive', bg: 'bg-positive/10' },
  FOOD: { label: 'Food', color: 'text-accent-gold', bg: 'bg-accent-gold-muted' },
  TRANSPORT: { label: 'Transport', color: 'text-positive', bg: 'bg-positive/10' },
  SHOPPING: { label: 'Shopping', color: 'text-negative', bg: 'bg-negative/10' },
  BILLS: { label: 'Bills', color: 'text-text-muted', bg: 'bg-ink' },
  REQUEST: { label: 'Request', color: 'text-text-muted', bg: 'bg-ink' },
}

export function formatDateGroup(dateStr) {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'

  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  })
}

export function groupTransactionsByDay(transactions) {
  const groups = new Map()

  for (const tx of transactions) {
    const key = new Date(tx.timestamp).toDateString()
    const existing = groups.get(key) ?? []
    existing.push(tx)
    groups.set(key, existing)
  }

  return Array.from(groups.entries()).map(([dayKey, items]) => ({
    dayKey,
    label: formatDateGroup(items[0].timestamp),
    items,
  }))
}

export function getTransactionLabel(tx, userEmail) {
  const isDebit = tx.senderEmail === userEmail
  const counterparty = isDebit ? tx.receiverEmail : tx.senderEmail

  if (tx.category === 'TOPUP') return 'Added to wallet'

  if (tx.category === 'REQUEST') {
    // Receiver is the requester; sender is the person asked to pay
    if (tx.receiverEmail === userEmail) {
      return `Requested from ${tx.senderEmail}`
    }
    return `Request from ${tx.receiverEmail}`
  }

  return isDebit ? `Sent to ${counterparty}` : `Received from ${counterparty}`
}

export function currentMonthKey() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${now.getFullYear()}-${month}`
}

export function toIsoStartOfDay(dateStr) {
  if (!dateStr) return undefined
  return new Date(`${dateStr}T00:00:00`).toISOString()
}

export function toIsoEndOfDay(dateStr) {
  if (!dateStr) return undefined
  return new Date(`${dateStr}T23:59:59`).toISOString()
}
