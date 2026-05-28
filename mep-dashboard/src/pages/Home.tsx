import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRecentVotes } from '../hooks/useMEPApi.ts'
import GroupFilter from '../components/GroupFilter.tsx'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeGroup, setActiveGroup] = useState('')
  const { data, isLoading, error } = useRecentVotes(1)

  const votes = data?.results || []

  // Client-side filter by search query and group (group filter applies to vote committees)
  const filtered = useMemo(() => {
    return votes.filter((v: any) => {
      if (searchQuery.trim().length >= 2) {
        const q = searchQuery.toLowerCase()
        const matchesSearch =
          (v.display_title || '').toLowerCase().includes(q) ||
          (v.description || '').toLowerCase().includes(q) ||
          (v.reference || '').toLowerCase().includes(q) ||
          (v.topics || []).some((t: any) => (t.label || '').toLowerCase().includes(q))
        if (!matchesSearch) return false
      }
      if (activeGroup) {
        // Check if any responsible committee matches (not a perfect group filter, but best we can do)
        const committees = (v.responsible_committees || []).map((c: any) => c.code)
        // Also check geo_areas as a rough filter
        const areas = (v.geo_areas || []).map((a: any) => a.code)
        return committees.includes(activeGroup) || areas.includes(activeGroup)
      }
      return true
    })
  }, [votes, searchQuery, activeGroup])

  const totalVotes = data?.total || 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">MEP Voting Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Browse roll-call votes in the European Parliament
        </p>
      </header>

      <div className="mb-6">
        <input
          type="search"
          placeholder="Search votes by title, description, or topic…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          aria-label="Search votes"
        />
      </div>

      <GroupFilter activeGroup={activeGroup} onChange={setActiveGroup} />

      {isLoading && <p className="text-gray-400 animate-pulse">Loading votes…</p>}
      {error && <p className="text-red-500">Failed to load votes. The API may be temporarily unavailable.</p>}

      {!isLoading && !error && filtered.length === 0 && (
        <p className="text-gray-500">
          {searchQuery.length >= 2
            ? `No votes found matching "${searchQuery}"`
            : 'No votes available'}
        </p>
      )}

      {filtered.length > 0 && (
        <>
          <p className="text-sm text-gray-400 mb-4">{totalVotes} total votes · showing most recent</p>
          <div className="space-y-3">
            {filtered.map((vote: any) => (
              <Link
                key={vote.id}
                to={`/vote/${vote.id}`}
                className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <h2 className="font-semibold text-gray-900">{vote.display_title || 'Untitled Vote'}</h2>
                {vote.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{vote.description}</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  {vote.timestamp && <span>{vote.timestamp.slice(0, 10)}</span>}
                  {vote.reference && <span>{vote.reference}</span>}
                  {vote.result && (
                    <span className={`font-medium ${
                      vote.result === 'ADOPTED' ? 'text-green-600' :
                      vote.result === 'REJECTED' ? 'text-red-600' : ''
                    }`}>{vote.result}</span>
                  )}
                </div>
                {(vote.topics || []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {vote.topics.slice(0, 3).map((t: any, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{t.label}</span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </>
      )}

      <p className="mt-8 text-xs text-gray-400 text-center">
        Data from <a href="https://howtheyvote.eu/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">HowTheyVote.eu</a> — sourced from the European Parliament · MEP profiles available at <Link to="/mep/118859" className="text-blue-600 hover:underline">/mep/:id</Link>
      </p>
    </div>
  )
}
