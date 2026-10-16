/** Categories returned by POST /api/insights/categorize */
export const INSIGHT_CATEGORIES = [
  'FOOD',
  'TRANSPORT',
  'SHOPPING',
  'BILLS',
  'TRANSFERS',
  'OTHER',
]

export const INSIGHT_LABELS = {
  FOOD: 'Food',
  TRANSPORT: 'Transport',
  SHOPPING: 'Shopping',
  BILLS: 'Bills',
  TRANSFERS: 'Transfers',
  OTHER: 'Other',
}

/** Map AI insight bucket → backend transaction category for transfers */
export function insightToTransactionCategory(insight) {
  const map = {
    FOOD: 'FOOD',
    TRANSPORT: 'TRANSPORT',
    SHOPPING: 'SHOPPING',
    BILLS: 'BILLS',
    TRANSFERS: 'TRANSFER',
    OTHER: 'TRANSFER',
  }
  return map[insight] ?? 'TRANSFER'
}

export const INSIGHT_TAG_COLORS = {
  FOOD: 'text-accent-gold bg-accent-gold-muted',
  TRANSPORT: 'text-positive bg-positive/10',
  SHOPPING: 'text-negative bg-negative/10',
  BILLS: 'text-text-muted bg-ink',
  TRANSFERS: 'text-accent-gold bg-accent-gold-muted',
  OTHER: 'text-text-muted bg-ink',
}
