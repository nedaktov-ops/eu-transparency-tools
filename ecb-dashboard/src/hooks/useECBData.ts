import { useQuery } from '@tanstack/react-query'
import type { EOObservation } from '../lib/types.ts'

/**
 * Fetch a full time series from the ECB Data Portal API.
 * Response is SDMX-JSON format.
 * The old SDW API (sdw-wsrest.ecb.europa.eu) was decommissioned — migrated to data-api.ecb.europa.eu in 2023.
 * New format: /service/data/{dataflow}/{key} where the old seriesKey is split at the first dot.
 */
export async function fetchECBSeries(seriesKey: string): Promise<EOObservation[]> {
  // New API splits the old key into dataflow + dimension key
  const dotIndex = seriesKey.indexOf('.')
  const dataflow = dotIndex > 0 ? seriesKey.slice(0, dotIndex) : seriesKey
  const key = dotIndex > 0 ? seriesKey.slice(dotIndex + 1) : ''

  const url = `https://data-api.ecb.europa.eu/service/data/${dataflow}/${key}?format=jsondata`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`ECB API error: ${res.status} for ${dataflow}`)
  const json = await res.json()

  const obsDim = json?.structure?.dimensions?.observation?.[0]

  // Series key varies between dataflows (e.g. '0:0:0:0:0' for EXR, '0:0:0:0:0:0:0:0:0:0:0' for BSI)
  // Find the first (and usually only) series dynamically
  const seriesMap =
    json?.dataSets?.[0]?.series as Record<string, { observations: Record<string, unknown> }> | undefined
  const firstSeriesKey = seriesMap ? Object.keys(seriesMap)[0] : undefined
  if (!firstSeriesKey || !seriesMap) throw new Error('No series data in ECB API response')

  const raw = seriesMap[firstSeriesKey].observations || {}

  return Object.entries(raw).map(([obsKey, val]) => ({
    period: obsDim?.values?.[parseInt(obsKey)]?.name || obsKey,
    value: Array.isArray(val) ? Number(val[0]) : typeof val === 'number' ? val : NaN,
  }))
}

/**
 * React Query hook for ECB time series data.
 */
export function useECBData(seriesKey: string) {
  return useQuery({
    queryKey: ['ecb', seriesKey],
    queryFn: () => fetchECBSeries(seriesKey),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  })
}
