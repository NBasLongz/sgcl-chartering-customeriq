export type EngineMode = 'CONTEXT_MATRIX' | 'NAIVE_KEYWORD' | 'CLOUD_AI';

export interface ScoringRules {
  weightCargo: number;
  weightRoute: number;
  weightVolume: number;
  thresholdA: number;
  thresholdB: number;
  dataMasking: boolean;
  bulkKeywords: string[];
  projectKeywords: string[];
  negativeKeywords: string[];
}

export type SortField = 'id' | 'company' | 'score';
export type SortDirection = 'asc' | 'desc';
