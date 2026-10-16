/**
 * Maps backend AuthResponse fields into the shape stored by the auth store.
 */
export function toSessionUser(data) {
  return {
    id: data.userId,
    name: data.name,
    email: data.email,
  }
}
