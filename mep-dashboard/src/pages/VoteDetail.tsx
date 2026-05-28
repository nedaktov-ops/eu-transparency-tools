import { useParams, Link } from 'react-router-dom'
import { POSITION_COLORS, MEP_GROUPS } from '../lib/constants.ts'
import { useVoteDetail } from '../hooks/useMEPApi.ts'

export default function VoteDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: vote, isLoading, error } = useVoteDetail(id)
  const total = vote ? vote.for_count + vote.against_count + vote.abstention_count : 0

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-8"><p className="text-gray-400 animate-pulse">Loading vote details…</p></div>
  if (error) return <div className="max-w-4xl mx-auto px-4 py-8"><p className="text-red-500">Failed to load vote details</p></div>
  if (!vote) return <div className="max-w-4xl mx-auto px-4 py-8"><p className="text-gray-500">Vote not found</p></div>

  // Count members by group for the breakdown
  const byGroup: Record<string, { FOR: number; AGAINST: number; ABSTENTION: number }> = {}
  for (const m of vote.memebers) {
    if (!byGroup[m.groupCode]) byGroup[m.groupCode] = { FOR: 0, AGAINST: 0, ABSTENTION: 0 }
    if (m.position === 'FOR') byGroup[m.groupCode].FOR++
    else if (m.position === 'AGAINST') byGroup[m.groupCode].AGAINST++
    else if (m.position === 'ABSTENTION') byGroup[m.groupCode].ABSTENTION++
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-blue-600 hover:underline mb-4 inline-block">← Back to Votes</Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{vote.title}</h1>
        {vote.reference && <p className="text-sm text-gray-500 mt-1">Reference: {vote.reference}</p>}
        <p className="text-sm text-gray-400 mt-1">{vote.date}</p>

        {/* Visual bar representation */}
        {total > 0 && (
          <div className="mt-6">
            <div className="flex h-8 rounded-lg overflow-hidden">
              {vote.for_count > 0 && (
                <div
                  className="flex items-center justify-center text-xs font-bold text-white"
                  style={{ width: `${(vote.for_count / total) * 100}%`, backgroundColor: POSITION_COLORS.FOR, minWidth: vote.for_count > 0 ? '4px' : '0' }}
                >
                  {vote.for_count > 10 ? `${Math.round((vote.for_count / total) * 100)}%` : ''}
                </div>
              )}
              {vote.against_count > 0 && (
                <div
                  className="flex items-center justify-center text-xs font-bold text-white"
                  style={{ width: `${(vote.against_count / total) * 100}%`, backgroundColor: POSITION_COLORS.AGAINST, minWidth: vote.against_count > 0 ? '4px' : '0' }}
                >
                  {vote.against_count > 10 ? `${Math.round((vote.against_count / total) * 100)}%` : ''}
                </div>
              )}
              {vote.abstention_count > 0 && (
                <div
                  className="flex items-center justify-center text-xs font-bold text-white"
                  style={{ width: `${(vote.abstention_count / total) * 100}%`, backgroundColor: POSITION_COLORS.ABSTENTION, minWidth: vote.abstention_count > 0 ? '4px' : '0' }}
                >
                  {vote.abstention_count > 10 ? `${Math.round((vote.abstention_count / total) * 100)}%` : ''}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg p-4 text-center" style={{ backgroundColor: `${POSITION_COLORS.FOR}15` }}>
            <p className="text-2xl font-bold" style={{ color: POSITION_COLORS.FOR }}>{vote.for_count}</p>
            <p className="text-sm font-medium" style={{ color: POSITION_COLORS.FOR }}>FOR</p>
          </div>
          <div className="rounded-lg p-4 text-center" style={{ backgroundColor: `${POSITION_COLORS.AGAINST}15` }}>
            <p className="text-2xl font-bold" style={{ color: POSITION_COLORS.AGAINST }}>{vote.against_count}</p>
            <p className="text-sm font-medium" style={{ color: POSITION_COLORS.AGAINST }}>AGAINST</p>
          </div>
          <div className="rounded-lg p-4 text-center" style={{ backgroundColor: `${POSITION_COLORS.ABSTENTION}15` }}>
            <p className="text-2xl font-bold" style={{ color: POSITION_COLORS.ABSTENTION }}>{vote.abstention_count}</p>
            <p className="text-sm font-medium" style={{ color: POSITION_COLORS.ABSTENTION }}>ABSTENTION</p>
          </div>
        </div>

        {/* Breakdown by political group */}
        {Object.keys(byGroup).length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">By Political Group</h2>
            <div className="space-y-2">
              {Object.entries(byGroup).map(([code, stats]) => {
                const gTotal = stats.FOR + stats.AGAINST + stats.ABSTENTION
                return (
                  <div key={code} className="flex items-center gap-3">
                    <span className="text-xs font-medium w-16 text-gray-600 text-right">{MEP_GROUPS[code]?.label || code}</span>
                    <div className="flex-1 flex h-5 rounded overflow-hidden bg-gray-100">
                      {stats.FOR > 0 && <div style={{ width: `${(stats.FOR / gTotal) * 100}%`, backgroundColor: POSITION_COLORS.FOR, minWidth: 2 }} title={`FOR: ${stats.FOR}`} />}
                      {stats.AGAINST > 0 && <div style={{ width: `${(stats.AGAINST / gTotal) * 100}%`, backgroundColor: POSITION_COLORS.AGAINST, minWidth: 2 }} title={`AGAINST: ${stats.AGAINST}`} />}
                      {stats.ABSTENTION > 0 && <div style={{ width: `${(stats.ABSTENTION / gTotal) * 100}%`, backgroundColor: POSITION_COLORS.ABSTENTION, minWidth: 2 }} title={`ABSTENTION: ${stats.ABSTENTION}`} />}
                    </div>
                    <span className="text-xs text-gray-400 w-8">{gTotal}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* MEP list */}
        {vote.memebers.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">Individual Votes</h2>
            <div className="mt-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-gray-500">MEP</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-500">Group</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-500">Position</th>
                  </tr>
                </thead>
                <tbody>
                  {vote.memebers.map(m => (
                    <tr key={m.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <Link to={`/mep/${m.id}`} className="text-blue-600 hover:underline font-medium">
                          {m.name}
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-gray-500">{m.group}</td>
                      <td className="px-3 py-2">
                        <span
                          className="inline-block text-xs px-2 py-0.5 rounded-full font-medium text-white"
                          style={{ backgroundColor: POSITION_COLORS[m.position] || '#6b7280' }}
                        >
                          {m.position === 'DID_NOT_VOTE' ? 'DID NOT VOTE' : m.position}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {vote.description && (
          <p className="mt-6 text-gray-700 leading-relaxed">{vote.description}</p>
        )}

        {vote.result && (
          <p className={`mt-4 text-sm font-medium ${vote.result === 'ADOPTED' ? 'text-green-600' : vote.result === 'REJECTED' ? 'text-red-600' : 'text-gray-600'}`}>
            Result: {vote.result}
          </p>
        )}

        <p className="mt-8 text-xs text-gray-400">
          Source: <a href={`https://howtheyvote.eu/votes/${id}`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">HowTheyVote.eu</a>
        </p>
      </div>
    </div>
  )
}
