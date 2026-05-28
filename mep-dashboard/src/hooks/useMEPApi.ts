import { useQuery } from '@tanstack/react-query'

const API_BASE = 'https://howtheyvote.eu/api'

interface MEP {
  id: number
  name: string
  group: string
  country: string
  photoUrl?: string
  thumbUrl?: string
}

interface MEPDetail {
  id: number
  name: string
  firstName: string
  lastName: string
  country: string
  countryCode: string
  group: string
  groupCode: string
  email?: string
  photoUrl?: string
  thumbUrl?: string
  committees?: string[]
  votes?: { id: string; title: string; position: string; date: string }[]
}

interface VoteDetail {
  id: string
  title: string
  date: string
  description?: string
  reference?: string
  result?: string
  for_count: number
  against_count: number
  abstention_count: number
}

/**
 * Search MEPs by name query.
 */
export function useSearchMEPs(query: string) {
  return useQuery({
    queryKey: ['searchMEP', query],
    queryFn: async (): Promise<MEP[]> => {
      if (!query.trim()) return []
      const res = await fetch(`${API_BASE}/members?search=${encodeURIComponent(query)}`)
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const data = await res.json()
      return data?.data || data || []
    },
    enabled: query.length >= 2,
    staleTime: 30 * 60 * 1000,
  })
}

/**
 * Fetch a single MEP's full profile.
 */
export function useMEPProfile(id: string | undefined) {
  return useQuery({
    queryKey: ['mep', id],
    queryFn: async (): Promise<MEPDetail> => {
      const res = await fetch(`${API_BASE}/members/${id}`)
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      return res.json()
    },
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  })
}

/**
 * Fetch a single vote's details.
 */
export function useVoteDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['vote', id],
    queryFn: async (): Promise<VoteDetail> => {
      const res = await fetch(`${API_BASE}/votes/${id}`)
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      return res.json()
    },
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  })
}
