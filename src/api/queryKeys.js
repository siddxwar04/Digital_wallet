export const queryKeys = {
  wallet: ['wallet'],
  transactions: (filters) => ['transactions', filters],
  transaction: (id) => ['transactions', id],
  summary: (month) => ['insights', 'summary', month],
}
