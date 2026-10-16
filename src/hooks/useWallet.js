import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getWallet } from '../api/wallet'
import { queryKeys } from '../api/queryKeys'

export function useWallet() {
  return useQuery({
    queryKey: queryKeys.wallet,
    queryFn: getWallet,
  })
}

/** Refetch wallet, transactions, and insights after a money-related mutation. */
export function useInvalidateMoneyQueries() {
  const queryClient = useQueryClient()

  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet }),
      queryClient.invalidateQueries({ queryKey: ['transactions'] }),
      queryClient.invalidateQueries({ queryKey: ['insights'] }),
    ])
  }
}

/** @deprecated Prefer useInvalidateMoneyQueries — kept for existing imports. */
export const useInvalidateAfterTransfer = useInvalidateMoneyQueries

export function useInvalidateWallet() {
  const queryClient = useQueryClient()

  return () =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.wallet,
    })
}

export function useClearServerState() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.clear()
  }
}
