import { Link } from 'react-router-dom'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { ECB_INDICATORS } from '../lib/constants.ts'
import { formatEUR, formatDecimal, formatECBDate } from '../lib/utils.ts'
import { useECBData } from '../hooks/useECBData.ts'

function formatLatest(indicator: typeof ECB_INDICATORS[number], value: number): string {
  switch (indicator.category) {
    case 'exchange-rate': return formatEUR(value)
    case 'inflation': return value.toFixed(2)
    case 'interest-rate': return `${value.toFixed(2)}%`
    case 'monetary': return formatDecimal(value / 1_000_000) + 'M'
    case 'economic': return formatDecimal(value / 1_000_000) + 'M'
    default: return value.toFixed(2)
  }
}

function Sparkline({ data }: { data: { value: number }[] }) {
  if (data.length < 2) return null
  return (
    <ResponsiveContainer width="100%" height={60}>
      <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke="#2563eb"
          strokeWidth={1.5}
          fill="url(#sparkGrad)"
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">ECB Data Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Euro area economic indicators from the European Central Bank
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ECB_INDICATORS.map(indicator => (
          <IndicatorCard key={indicator.key} indicator={indicator} />
        ))}
      </div>
    </div>
  )
}

function IndicatorCard({ indicator }: { indicator: typeof ECB_INDICATORS[number] }) {
  const { data, isLoading, error } = useECBData(indicator.key)

  const latest = data?.[data.length - 1]
  const previous = data?.[data.length - 2]
  const change = latest && previous ? latest.value - previous.value : null

  return (
    <Link
      to={`/indicator/${indicator.key}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
        {indicator.category.replace('-', ' ')}
      </h2>
      <p className="text-lg font-semibold text-gray-900 mt-1">{indicator.label}</p>
      {isLoading && <p className="text-gray-400 mt-4 animate-pulse">Loading…</p>}
      {error && <p className="text-red-500 mt-4 text-sm">Failed to load data</p>}
      {latest && (
        <div className="mt-4">
          <p className="text-3xl font-bold text-gray-900">
            {formatLatest(indicator, latest.value)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {formatECBDate(latest.period)}
            {change !== null && (
              <span className={`ml-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(4)}
              </span>
            )}
          </p>
        </div>
      )}
      {data && data.length > 0 && (
        <div className="mt-4 -mx-2">
          <Sparkline data={data.slice(-40)} />
        </div>
      )}
      <p className="text-xs text-gray-400 mt-3">{indicator.description}</p>
      <p className="text-xs text-gray-300 mt-2">
        ECB SDW · {indicator.key}
      </p>
    </Link>
  )
}
