import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getWallet } from '../api/wallet'
import { queryKeys } from '../api/queryKeys'

export function useWallet() {
  return useQuery({
    queryKey: queryKeys.wallet,
    queryFn: getWallet,
  })
}

/** Refetch wallet + any transaction queries after a successful mutation. */
export function useInvalidateAfterTransfer() {
  const queryClient = useQueryClient()

  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet }),
      queryClient.invalidateQueries({ queryKey: ['transactions'] }),
    ])
  }
}

export function useInvalidateWallet() {
  const queryClient = useQueryClient()

  return () =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.wallet,
    })
}
