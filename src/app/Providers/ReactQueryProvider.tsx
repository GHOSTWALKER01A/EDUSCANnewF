'use client'
import React, { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createQueryClient } from '../../lib/queryClient'

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  // keep a single QueryClient instance for the whole client session
  const [queryClient] = useState(() => createQueryClient())

  return (
    
     <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
