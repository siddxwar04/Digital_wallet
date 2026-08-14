import api from './client'

export async function getTransactions(params = {}) {
  const { data } = await api.get('/api/transactions', { params })
  return data
}

export async function getTransaction(id) {
  const { data } = await api.get(`/api/transactions/${id}`)
  return data
}
