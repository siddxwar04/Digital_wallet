/**
 * Pulls a plain user-facing message from an Axios/network error.
 */
export function getErrorMessage(error, fallback = 'Something went wrong') {
  const apiMessage = error?.response?.data?.message
  if (typeof apiMessage === 'string' && apiMessage.trim()) {
    return apiMessage
  }

  if (error?.code === 'ERR_NETWORK') {
    return 'Cannot reach the server — check that the API is running'
  }

  if (typeof error?.message === 'string' && error.message && !error.response) {
    return error.message
  }

  return fallback
}
