// ECB Dashboard — local utils (copied from shared package, self-contained)

export function formatECBDate(dateStr: string): string {
  if (!dateStr) return ''
  if (/^\d{4}$/.test(dateStr)) return dateStr
  const semiMatch = dateStr.match(/^(\d{4})-S([12])$/)
  if (semiMatch) return `H${semiMatch[2]} ${semiMatch[1]}`
  const qMatch = dateStr.match(/^(\d{4})-Q([1234])$/)
  if (qMatch) return `Q${qMatch[2]} ${qMatch[1]}`
  const monthMatch = dateStr.match(/^(\d{4})-(\d{2})$/)
  if (monthMatch) {
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const idx = parseInt(monthMatch[2], 10) - 1
    if (idx >= 0 && idx < 12) return `${monthNames[idx]} ${monthMatch[1]}`
    return dateStr
  }
  const date = new Date(dateStr)
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  return dateStr
}

export function formatEUR(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency', currency: 'EUR',
    minimumFractionDigits: 2, maximumFractionDigits: 4,
  }).format(value)
}

export function formatDecimal(value: number, decimals: number = 2): string {
  return value.toLocaleString('en-GB', {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  })
}
