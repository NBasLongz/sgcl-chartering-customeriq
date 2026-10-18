import { RawLead } from '../types/lead';
import { ScoringRules } from '../types/rules';
import { DEFAULT_RAW_LEADS } from '../data/default-leads';
import { DEFAULT_RULES } from '../data/default-rules';

const STORAGE_KEY_LEADS = 'sgcl_crm_leads_v2';
const STORAGE_KEY_RULES = 'sgcl_crm_rules_v2';

export function loadSavedRules(): ScoringRules {
  if (typeof window === 'undefined') return DEFAULT_RULES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RULES);
    if (raw) {
      return { ...DEFAULT_RULES, ...JSON.parse(raw) };
    }
  } catch {
    // fallback
  }
  return DEFAULT_RULES;
}

export function saveRulesToStorage(rules: ScoringRules): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(rules));
  } catch {
    // ignore quota
  }
}

export function loadSavedLeads(): RawLead[] {
  if (typeof window === 'undefined') return DEFAULT_RAW_LEADS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEADS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_RAW_LEADS;
}

export function saveLeadsToStorage(leads: RawLead[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads));
  } catch {
    // ignore quota
  }
}

export function clearSavedStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_LEADS);
    localStorage.removeItem(STORAGE_KEY_RULES);
  } catch {
    // ignore
  }
}
