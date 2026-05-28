import { useQuery } from '@tanstack/react-query'
import type { EOObservation } from '../lib/types.ts'

/**
 * Fetch a full time series from the ECB SDW API.
 * Response is JSON-stat format.
 */
export async function fetchECBSeries(seriesKey: string): Promise<EOObservation[]> {
  const url = `https://sdw-wsrest.ecb.europa.eu/service/data/${seriesKey}?format=jsondata`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`ECB API error: ${res.status}`)
  const json = await res.json()

  const obsDim = json?.structure?.dimensions?.observation?.[0]
  const raw: Record<string, number[]> = json?.dataSets?.[0]?.series?.['0:0:0:0:0']?.observations || {}

  return Object.entries(raw).map(([key, val]) => ({
    period: obsDim?.values?.[parseInt(key)]?.name || key,
    value: val[0],
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
