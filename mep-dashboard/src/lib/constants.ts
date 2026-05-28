// MEP Dashboard — local constants (copied from shared package, self-contained)

export interface PoliticalGroup {
  code: string
  label: string
  color: string
  labelEn: string
  labelFr: string
}

export const MEP_GROUPS: Record<string, PoliticalGroup> = {
  'EPP': { code: 'EPP', label: 'EPP', color: '#1a3a8a', labelEn: "European People's Party", labelFr: 'Parti populaire européen' },
  'S&D': { code: 'S&D', label: 'S&D', color: '#d62728', labelEn: 'Progressive Alliance of Socialists and Democrats', labelFr: 'Alliance progressiste des socialistes et démocrates' },
  'Renew': { code: 'Renew', label: 'Renew Europe', color: '#ffbf00', labelEn: 'Renew Europe', labelFr: "Renouveler l'Europe" },
  'Greens': { code: 'Greens', label: 'Greens/EFA', color: '#2d9c3c', labelEn: 'Greens/European Free Alliance', labelFr: 'Verts/Alliance libre européenne' },
  'ECR': { code: 'ECR', label: 'ECR', color: '#1a6b8a', labelEn: 'European Conservatives and Reformists', labelFr: 'Conservateurs et réformistes européens' },
  'PfE': { code: 'PfE', label: 'PfE', color: '#8b4513', labelEn: 'Patriots for Europe', labelFr: "Patriotes pour l'Europe" },
  'Left': { code: 'Left', label: 'The Left', color: '#b30000', labelEn: 'The Left in the European Parliament', labelFr: 'La Gauche au Parlement européen' },
  'NI': { code: 'NI', label: 'NI', color: '#6b7280', labelEn: 'Non-attached Members', labelFr: 'Non-inscrits' },
}

export const POSITION_COLORS: Record<string, string> = {
  'FOR': '#2563eb',
  'AGAINST': '#dc2626',
  'ABSTENTION': '#6b7280',
  'DID_NOT_VOTE': '#d1d5db',
}

export function getGroupColor(groupCode: string): string {
  return MEP_GROUPS[groupCode]?.color ?? '#6b7280'
}
