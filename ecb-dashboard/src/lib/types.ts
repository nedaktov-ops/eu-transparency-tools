// ECB Dashboard — local types (copied from shared package, self-contained)

export interface EOObservation {
  /** ISO date string (YYYY-MM-DD or YYYY-MM or YYYY depending on frequency) */
  period: string;
  /** Numeric value of the observation */
  value: number;
}

export interface ECBIndicator {
  /** ECB API series key */
  key: string;
  /** Display label */
  label: string;
  /** Unit for display */
  unit: string;
  /** Short description */
  description: string;
  /** Category for grouping */
  category: 'exchange-rate' | 'inflation' | 'interest-rate' | 'monetary' | 'economic';
}
