import api from './client'

export async function getMonthlySummary(month) {
  const { data } = await api.get('/api/insights/summary', { params: { month } })
  return data
}

export async function categorize(description) {
  const { data } = await api.post('/api/insights/categorize', { description })
  return data
}
