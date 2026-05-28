import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts'
import type { EOObservation, ECBIndicator } from '../lib/types.ts'
import { formatECBDate } from '../lib/utils.ts'

interface TimeSeriesChartProps {
  data: EOObservation[]
  indicator: ECBIndicator
  height?: number
}

function formatValue(value: number, unit: string): string {
  if (unit.includes('EUR') || unit.includes('euro')) return `€${value.toFixed(4)}`
  if (unit.includes('%')) return `${value.toFixed(2)}%`
  if (unit.includes('Index')) return value.toFixed(2)
  if (unit.includes('millions')) return `${(value / 1_000_000).toFixed(1)}M`
  return value.toFixed(2)
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const obs = payload[0].payload as EOObservation
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-900">{formatECBDate(obs.period)}</p>
      <p className="text-blue-600 font-medium mt-1">
        {formatValue(obs.value, '')}
      </p>
    </div>
  )
}

export default function TimeSeriesChart({ data, height = 400 }: TimeSeriesChartProps) {
  if (data.length === 0) {
    return <div className="text-gray-400 text-sm py-8 text-center">No data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="period"
          tickFormatter={formatECBDate}
          tick={{ fontSize: 11, fill: '#6b7280' }}
          interval="preserveStartEnd"
          minTickGap={60}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#6b7280' }}
          domain={['auto', 'auto']}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#2563eb"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
