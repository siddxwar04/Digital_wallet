/** Turns "rahul.sharma@example.com" into "Rahul" for short success copy. */
export function displayNameFromEmail(email) {
  if (!email) return 'recipient'
  const local = email.split('@')[0] || email
  const first = local.split(/[._-]/)[0] || local
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0)
}
