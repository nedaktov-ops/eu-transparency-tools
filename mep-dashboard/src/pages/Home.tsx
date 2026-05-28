import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MEP_GROUPS } from '../lib/constants.ts'
import { useSearchMEPs } from '../hooks/useMEPApi.ts'
import GroupFilter from '../components/GroupFilter.tsx'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeGroup, setActiveGroup] = useState('')
  const { data: results, isLoading } = useSearchMEPs(searchQuery)

  const filtered = results?.filter(mep =>
    activeGroup ? mep.group === activeGroup : true
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">MEP Voting Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Browse how Members of the European Parliament vote
        </p>
      </header>
      <div className="mb-6">
        <input
          type="search"
          placeholder="Search MEPs by name…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          aria-label="Search MEPs"
        />
      </div>
      <GroupFilter activeGroup={activeGroup} onChange={setActiveGroup} />
      {isLoading && <p className="text-gray-400 animate-pulse">Searching…</p>}
      {filtered && filtered.length === 0 && searchQuery.length >= 2 && (
        <p className="text-gray-500">No MEPs found matching "{searchQuery}"</p>
      )}
      {filtered && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(mep => (
            <Link
              key={mep.id}
              to={`/mep/${mep.id}`}
              className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow border-l-4"
              style={{ borderLeftColor: getGroupColor(mep.group) }}
            >
              <div className="flex items-center gap-3">
                {mep.thumbUrl && (
                  <img src={mep.thumbUrl} alt="" className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                )}
                <div>
                  <p className="font-semibold text-gray-900">{mep.name}</p>
                  <p className="text-sm text-gray-500">{mep.group} · {mep.country}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <p className="mt-8 text-xs text-gray-400 text-center">
        Data from <a href="https://howtheyvote.eu/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">HowTheyVote.eu</a> — sourced from the European Parliament
      </p>
    </div>
  )
}

function getGroupColor(group: string): string {
  const found = Object.values(MEP_GROUPS).find(g => g.label === group || g.code === group)
  return found?.color || '#6b7280'
}
