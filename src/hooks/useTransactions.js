import { useQuery } from '@tanstack/react-query'
import { getTransactions } from '../api/transactions'
import { queryKeys } from '../api/queryKeys'

export function useTransactions({ page, size, category, from, to }) {
  return useQuery({
    queryKey: queryKeys.transactions({ page, size, category, from, to }),
    queryFn: () =>
      getTransactions({
        page,
        size,
        category: category || undefined,
        from: from || undefined,
        to: to || undefined,
      }),
    placeholderData: (previous) => previous,
  })
}
