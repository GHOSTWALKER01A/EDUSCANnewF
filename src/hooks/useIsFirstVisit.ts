



export function useIsFirstVisit(key = 'eduscan_first_visit') {
  const seen = typeof window !== 'undefined' && localStorage.getItem(key)
  return !seen
}
