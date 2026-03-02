import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, Mock } from 'vitest'
import { useDoubts } from '../src/hooks/useDoubt'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import api from '../src/lib/api'

vi.mock('../src/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    put: vi.fn(),
  }
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useDoubts Hook', () => {
  it('fetches doubts initially', async () => {
    const mockDoubts = [
      { id: '1', title: 'Test Doubt', status: 'PENDING' }
    ]
    
    ;(api.get as Mock).mockResolvedValue({ 
      data: { data: { events: mockDoubts, page: 1, limit: 10, total: 1 } } 
    })

    const { result } = renderHook(() => useDoubts({ limit: 10 }), { wrapper })

    await waitFor(() => {
      expect(result.current.query.isSuccess).toBe(true)
    })

    // Because it uses InfiniteQuery, the data structure is pages
    expect(result.current.query.data?.pages[0].events).toEqual(mockDoubts)
  })
})
