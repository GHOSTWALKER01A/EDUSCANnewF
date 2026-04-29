// src/lib/queryClient.ts
import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error: any) => {
        // Optionally show toast for failed queries, but usually silent is better for queries
        // console.error('Query Failed:', error)
      }
    }),
    mutationCache: new MutationCache({
      onError: (error: any) => {
        // Global error toast for all mutation failures
        const message = error?.response?.data?.message || error.message || 'Something went wrong';
        toast.error(message, { toastId: 'global-mutation-error' })
      }
    }),
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 30_000,
      },
    },
  })
}
