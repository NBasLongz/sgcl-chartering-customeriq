export interface KpiMetrics {
  total: number;
  suitableCount: number;
  suitablePct: string;
  groupACount: number;
  groupAPct: string;
  groupBCount: number;
  groupBPct: string;
  groupCCount: number;
  groupCPct: string;
  bulkCount: number;
  projectCount: number;
  needsReviewCount: number;
  manualMinutes: number;
  assistedMinutes: number;
  savedMinutes: number;
  savedPct: string;
  hoursSaved: string;
}

export interface HistoricalBenchmarkItem {
  criterion: string;
  unit: string;
  year2024: string;
  year2025: string;
  changePct: string;
  highlight?: boolean;
}
