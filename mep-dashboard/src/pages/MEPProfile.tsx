import { useParams, Link } from 'react-router-dom'
import { POSITION_COLORS } from '../lib/constants.ts'
import { useMEPProfile } from '../hooks/useMEPApi.ts'

export default function MEPProfile() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, error } = useMEPProfile(id)

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-8"><p className="text-gray-400 animate-pulse">Loading MEP profile…</p></div>
  if (error) return <div className="max-w-4xl mx-auto px-4 py-8"><p className="text-red-500">Failed to load MEP profile</p></div>
  if (!data) return <div className="max-w-4xl mx-auto px-4 py-8"><p className="text-gray-500">MEP not found</p></div>

  const countedVotes = data.votes || []
  const forVotes = countedVotes.filter(v => v.position === 'FOR').length
  const againstVotes = countedVotes.filter(v => v.position === 'AGAINST').length
  const abstVotes = countedVotes.filter(v => v.position === 'ABSTENTION').length

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-blue-600 hover:underline mb-4 inline-block">← Back to Search</Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          {data.photoUrl && (
            <img src={data.photoUrl} alt="" className="w-20 h-20 rounded-full object-cover bg-gray-100" />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
            <p className="text-gray-600 mt-1">{data.group} · {data.country}</p>
            {data.email && <p className="text-sm text-gray-500 mt-1">{data.email}</p>}
          </div>
        </div>

        {countedVotes.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-lg p-4 text-center" style={{ backgroundColor: `${POSITION_COLORS.FOR}15` }}>
              <p className="text-2xl font-bold" style={{ color: POSITION_COLORS.FOR }}>{forVotes}</p>
              <p className="text-sm font-medium" style={{ color: POSITION_COLORS.FOR }}>FOR</p>
            </div>
            <div className="rounded-lg p-4 text-center" style={{ backgroundColor: `${POSITION_COLORS.AGAINST}15` }}>
              <p className="text-2xl font-bold" style={{ color: POSITION_COLORS.AGAINST }}>{againstVotes}</p>
              <p className="text-sm font-medium" style={{ color: POSITION_COLORS.AGAINST }}>AGAINST</p>
            </div>
            <div className="rounded-lg p-4 text-center" style={{ backgroundColor: `${POSITION_COLORS.ABSTENTION}15` }}>
              <p className="text-2xl font-bold" style={{ color: POSITION_COLORS.ABSTENTION }}>{abstVotes}</p>
              <p className="text-sm font-medium" style={{ color: POSITION_COLORS.ABSTENTION }}>ABSTENTION</p>
            </div>
          </div>
        )}

        {data.committees && data.committees.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Committees</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.committees.map((c: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{c}</span>
              ))}
            </div>
          </div>
        )}

        {countedVotes.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">Recent Votes</h2>
            <div className="mt-4 space-y-2">
              {countedVotes.slice(0, 20).map((vote: any) => (
                <Link
                  key={vote.id}
                  to={`/vote/${vote.id}`}
                  className="block bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow"
                >
                  <p className="text-sm text-gray-900">{vote.title}</p>
                  {vote.date && <p className="text-xs text-gray-400 mt-0.5">{vote.date}</p>}
                  <span
                    className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium text-white"
                    style={{ backgroundColor: POSITION_COLORS[vote.position as string] || '#6b7280' }}
                  >
                    {vote.position}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <p className="mt-8 text-xs text-gray-400">
          Source: <a href={`https://howtheyvote.eu/members/${id}`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">HowTheyVote.eu</a> · European Parliament
        </p>
      </div>
    </div>
  )
}
