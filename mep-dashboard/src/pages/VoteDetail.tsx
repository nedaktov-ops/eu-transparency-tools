import { useParams, Link } from 'react-router-dom'
import { POSITION_COLORS } from '../lib/constants.ts'
import { useVoteDetail } from '../hooks/useMEPApi.ts'

export default function VoteDetail() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, error } = useVoteDetail(id)
  const total = data ? data.for_count + data.against_count + data.abstention_count : 0

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-8"><p className="text-gray-400 animate-pulse">Loading vote details…</p></div>
  if (error) return <div className="max-w-4xl mx-auto px-4 py-8"><p className="text-red-500">Failed to load vote details</p></div>
  if (!data) return <div className="max-w-4xl mx-auto px-4 py-8"><p className="text-gray-500">Vote not found</p></div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-blue-600 hover:underline mb-4 inline-block">← Back to Search</Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{data.title}</h1>
        {data.reference && <p className="text-sm text-gray-500 mt-1">Reference: {data.reference}</p>}
        <p className="text-sm text-gray-400 mt-1">{data.date}</p>

        {/* Visual bar representation */}
        {total > 0 && (
          <div className="mt-6">
            <div className="flex h-8 rounded-lg overflow-hidden">
              {data.for_count > 0 && (
                <div
                  className="flex items-center justify-center text-xs font-bold text-white"
                  style={{ width: `${(data.for_count / total) * 100}%`, backgroundColor: POSITION_COLORS.FOR, minWidth: data.for_count > 0 ? '4px' : '0' }}
                >
                  {data.for_count > 10 ? `${Math.round((data.for_count / total) * 100)}%` : ''}
                </div>
              )}
              {data.against_count > 0 && (
                <div
                  className="flex items-center justify-center text-xs font-bold text-white"
                  style={{ width: `${(data.against_count / total) * 100}%`, backgroundColor: POSITION_COLORS.AGAINST, minWidth: data.against_count > 0 ? '4px' : '0' }}
                >
                  {data.against_count > 10 ? `${Math.round((data.against_count / total) * 100)}%` : ''}
                </div>
              )}
              {data.abstention_count > 0 && (
                <div
                  className="flex items-center justify-center text-xs font-bold text-white"
                  style={{ width: `${(data.abstention_count / total) * 100}%`, backgroundColor: POSITION_COLORS.ABSTENTION, minWidth: data.abstention_count > 0 ? '4px' : '0' }}
                >
                  {data.abstention_count > 10 ? `${Math.round((data.abstention_count / total) * 100)}%` : ''}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg p-4 text-center" style={{ backgroundColor: `${POSITION_COLORS.FOR}15` }}>
            <p className="text-2xl font-bold" style={{ color: POSITION_COLORS.FOR }}>{data.for_count}</p>
            <p className="text-sm font-medium" style={{ color: POSITION_COLORS.FOR }}>FOR</p>
          </div>
          <div className="rounded-lg p-4 text-center" style={{ backgroundColor: `${POSITION_COLORS.AGAINST}15` }}>
            <p className="text-2xl font-bold" style={{ color: POSITION_COLORS.AGAINST }}>{data.against_count}</p>
            <p className="text-sm font-medium" style={{ color: POSITION_COLORS.AGAINST }}>AGAINST</p>
          </div>
          <div className="rounded-lg p-4 text-center" style={{ backgroundColor: `${POSITION_COLORS.ABSTENTION}15` }}>
            <p className="text-2xl font-bold" style={{ color: POSITION_COLORS.ABSTENTION }}>{data.abstention_count}</p>
            <p className="text-sm font-medium" style={{ color: POSITION_COLORS.ABSTENTION }}>ABSTENTION</p>
          </div>
        </div>

        {data.description && (
          <p className="mt-6 text-gray-700 leading-relaxed">{data.description}</p>
        )}

        {data.result && (
          <p className="mt-4 text-sm font-medium text-gray-600">Result: {data.result}</p>
        )}

        <p className="mt-8 text-xs text-gray-400">
          Source: <a href={`https://howtheyvote.eu/votes/${id}`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">HowTheyVote.eu</a>
        </p>
      </div>
    </div>
  )
}
