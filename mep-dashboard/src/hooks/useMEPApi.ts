import { useQuery } from '@tanstack/react-query'

const API_BASE = 'https://howtheyvote.eu/api'

/* ─── Types matching the actual HowTheyVote API ─── */

export interface HowTheyVoteMember {
  id: number
  full_name: string
  first_name: string
  last_name: string
  country: { code: string; iso_alpha_2?: string; label: string }
  group: { code: string; short_label: string; label: string }
  photo_url: string
  thumb_url: string
  email?: string
  date_of_birth?: string
  terms?: number[]
}

export interface HowTheyVoteBaseVote {
  id: number
  is_main: boolean
  timestamp: string
  display_title: string
  description?: string
  reference?: string
  result?: string
  geo_areas: { code: string; label: string }[]
  topics: { code: string; label: string }[]
  responsible_committees: { code: string; label: string }[]
}

export interface HowTheyVoteVoteDetail extends HowTheyVoteBaseVote {
  stats: {
    total: { FOR: number; AGAINST: number; ABSTENTION: number; DID_NOT_VOTE: number }
    by_group: { group: HowTheyVoteMember['group']; stats: { FOR: number; AGAINST: number; ABSTENTION: number; DID_NOT_VOTE: number } }[]
    by_country: { country: HowTheyVoteMember['country']; stats: { FOR: number; AGAINST: number; ABSTENTION: number; DID_NOT_VOTE: number } }[]
  }
  member_votes: { member: HowTheyVoteMember; position: string }[]
  procedure?: { title: string; type: string; reference: string }
  snippet?: { text: string; source_type: string; source_url: string }
  sources: { name: string; url: string }[]
}

/* ─── UI-facing types ─── */

export interface MEPCard {
  id: number
  name: string
  groupCode: string
  groupLabel: string
  country: string
  photoUrl: string
  thumbUrl: string
}

export interface MEPProfile {
  id: number
  name: string
  firstName: string
  lastName: string
  country: string
  group: string
  groupCode: string
  email?: string
  photoUrl: string
  thumbUrl: string
  recentVotes: { id: number; title: string; position: string; date: string }[]
  voteStats: { FOR: number; AGAINST: number; ABSTENTION: number }
}

export interface VoteDetail {
  id: number
  title: string
  date: string
  description?: string
  reference?: string
  result?: string
  for_count: number
  against_count: number
  abstention_count: number
  memebers: { id: number; name: string; group: string; groupCode: string; position: string }[]
}

/* ─── Hooks ─── */

/**
 * Fetch a single MEP's full profile.
 */
export function useMEPProfile(id: string | undefined) {
  return useQuery({
    queryKey: ['mep', id],
    queryFn: async (): Promise<MEPProfile> => {
      const [memberRes, votesRes] = await Promise.all([
        fetch(`${API_BASE}/members/${id}`),
        fetch(`${API_BASE}/members/${id}/votes?page=1&page_size=50&sort_by=date&sort_order=desc`),
      ])
      if (!memberRes.ok) throw new Error(`MEP API error: ${memberRes.status}`)
      const member: HowTheyVoteMember = await memberRes.json()

      let recentVotes: MEPProfile['recentVotes'] = []
      let voteStats = { FOR: 0, AGAINST: 0, ABSTENTION: 0 }
      if (votesRes.ok) {
        const votesData = await votesRes.json()
        recentVotes = (votesData.results || []).map((v: any) => ({
          id: v.id,
          title: v.display_title || '',
          position: v.position || 'DID_NOT_VOTE',
          date: v.timestamp ? v.timestamp.slice(0, 10) : '',
        }))
        for (const v of recentVotes) {
          if (v.position === 'FOR') voteStats.FOR++
          else if (v.position === 'AGAINST') voteStats.AGAINST++
          else if (v.position === 'ABSTENTION') voteStats.ABSTENTION++
        }
      }

      return {
        id: member.id,
        name: member.full_name,
        firstName: member.first_name,
        lastName: member.last_name,
        country: member.country?.label || '',
        group: member.group?.label || '',
        groupCode: member.group?.code || '',
        email: member.email,
        photoUrl: `${API_BASE}${member.photo_url}`,
        thumbUrl: `${API_BASE}${member.thumb_url}`,
        recentVotes,
        voteStats,
      }
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
      if (!res.ok) throw new Error(`Vote API error: ${res.status}`)
      const data: HowTheyVoteVoteDetail = await res.json()

      return {
        id: data.id,
        title: data.display_title || '',
        date: data.timestamp ? data.timestamp.slice(0, 10) : '',
        description: data.description || data.snippet?.text?.replace(/<[^>]+>/g, '') || undefined,
        reference: data.reference,
        result: data.result,
        for_count: data.stats?.total?.FOR || 0,
        against_count: data.stats?.total?.AGAINST || 0,
        abstention_count: data.stats?.total?.ABSTENTION || 0,
        memebers: (data.member_votes || []).map(mv => ({
          id: mv.member.id,
          name: mv.member.full_name,
          group: mv.member.group?.label || '',
          groupCode: mv.member.group?.code || '',
          position: mv.position,
        })),
      }
    },
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  })
}

/**
 * Fetch recent votes for the home page.
 */
export function useRecentVotes(page: number = 1) {
  return useQuery({
    queryKey: ['recentVotes', page],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/votes?page=${page}&page_size=20&sort_by=date&sort_order=desc`)
      if (!res.ok) throw new Error(`Votes API error: ${res.status}`)
      return res.json()
    },
    staleTime: 10 * 60 * 1000,
  })
}
