import { useQuery } from '@tanstack/react-query'
import { getMonthlySummary } from '../api/insights'
import { queryKeys } from '../api/queryKeys'

export function useInsightsSummary(month) {
  return useQuery({
    queryKey: queryKeys.summary(month),
    queryFn: () => getMonthlySummary(month),
    enabled: Boolean(month),
  })
}
