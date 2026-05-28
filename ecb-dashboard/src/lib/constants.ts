// ECB Dashboard — local constants (copied from shared package, self-contained)

import type { ECBIndicator } from './types.ts'

export const ECB_INDICATORS: ECBIndicator[] = [
  {
    key: 'EXR.D.USD.EUR.SP00.A',
    label: 'EUR/USD Exchange Rate',
    unit: 'USD per EUR',
    description: 'Daily euro foreign exchange reference rate: US dollar against euro',
    category: 'exchange-rate',
  },
  {
    key: 'ICP.M.U2.Y.000000.3.INX',
    label: 'HICP - All Items Index',
    unit: 'Index (2015=100)',
    description: 'Harmonised Index of Consumer Prices, all items, Euro area (changing composition)',
    category: 'inflation',
  },
  {
    key: 'FM.D.U2.EUR.4F.KR.MRR_FR.LEV',
    label: 'ECB Main Refinancing Rate',
    unit: '%',
    description: 'ECB official interest rate: Main refinancing operations, fixed rate',
    category: 'interest-rate',
  },
  {
    key: 'BSI.M.U2.Y.V.M30.X.1.U2.2300.Z01.E',
    label: 'M3 Monetary Aggregate',
    unit: 'EUR millions',
    description: 'Monetary aggregate M3 for the euro area',
    category: 'monetary',
  },
  {
    key: 'MNA.Q.Y.I9.W2.S1.S1.B.B1GQ._Z._Z._Z.XDC.LR.N',
    label: 'GDP - Gross Domestic Product',
    unit: 'EUR millions',
    description: 'Gross domestic product at market prices, euro area, chain linked volumes',
    category: 'economic',
  },
]
