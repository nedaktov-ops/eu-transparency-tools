import { useParams, Link } from 'react-router-dom'
import { ECB_INDICATORS } from '../lib/constants.ts'
import { formatECBDate } from '../lib/utils.ts'
import { useECBData } from '../hooks/useECBData.ts'
import TimeSeriesChart from '../components/TimeSeriesChart.tsx'

export default function IndicatorDetail() {
  const { seriesKey } = useParams<{ seriesKey: string }>()
  const indicator = ECB_INDICATORS.find(i => i.key === seriesKey)

  const { data, isLoading, error } = useECBData(seriesKey || '')

  if (!indicator) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-red-500 text-lg">Indicator not found</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">← Back to Dashboard</Link>
      </div>
    )
  }

  const latest = data?.[data.length - 1]
  const previous = data?.[data.length - 2]
  const change = latest && previous ? latest.value - previous.value : null
  const recent20 = data?.slice(-20).reverse()

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-blue-600 hover:underline mb-4 inline-block">← Back to Dashboard</Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{indicator.label}</h1>
          <p className="text-gray-500 mt-1">{indicator.description}</p>
          <p className="text-xs text-gray-400 mt-1">Unit: {indicator.unit} · Series: {indicator.key}</p>
        </div>
        {latest && (
          <div className="text-right">
            <p className="text-4xl font-bold text-gray-900">
              {indicator.category === 'exchange-rate' ? `€${latest.value.toFixed(4)}` :
               indicator.category === 'inflation' ? `${latest.value.toFixed(2)}` :
               `${latest.value.toFixed(2)}`}
            </p>
            <p className="text-sm text-gray-500">{formatECBDate(latest.period)}</p>
            {change !== null && (
              <p className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(4)}
              </p>
            )}
          </div>
        )}
      </div>

      {isLoading && <div className="h-80 bg-gray-100 rounded-xl animate-pulse flex items-center justify-center text-gray-400">Loading data…</div>}
      {error && <div className="h-80 bg-red-50 rounded-xl flex items-center justify-center text-red-500">Failed to load data</div>}
      {data && data.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Time Series</h2>
          <TimeSeriesChart data={data} indicator={indicator} height={400} />
        </div>
      )}

      {recent20 && recent20.length > 0 && (
        <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Observations (last 20)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <th className="px-6 py-3 text-left">Period</th>
                  <th className="px-6 py-3 text-right">Value</th>
                  <th className="px-6 py-3 text-right">Change</th>
                </tr>
              </thead>
              <tbody>
                {recent20.map((obs, i) => {
                  const prevVal = recent20[i + 1]?.value
                  const ch = prevVal !== undefined ? obs.value - prevVal : null
                  return (
                    <tr key={obs.period} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-3 text-gray-700">{formatECBDate(obs.period)}</td>
                      <td className="px-6 py-3 text-right font-mono text-gray-900">{obs.value.toFixed(4)}</td>
                      <td className={`px-6 py-3 text-right font-mono ${ch !== null && ch >= 0 ? 'text-green-600' : ch !== null && ch < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                        {ch !== null ? `${ch >= 0 ? '+' : ''}${ch.toFixed(4)}` : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="mt-6 text-xs text-gray-400">
        Source: <a href={`https://sdw-wsrest.ecb.europa.eu/service/data/${indicator.key}?format=jsondata`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ECB SDW API</a>
      </p>
    </div>
  )
}
