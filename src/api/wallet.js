import api from './client'

export async function getWallet() {
  const { data } = await api.get('/api/wallet')
  return data
}

export async function addMoney(amount) {
  const { data } = await api.post('/api/wallet/add-money', { amount })
  return data
}

export async function transfer({ receiverEmail, amount, category }) {
  const { data } = await api.post('/api/wallet/transfer', {
    receiverEmail,
    amount,
    category,
  })
  return data
}
