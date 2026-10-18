/**
 * Data Masking & Anonymization Engine
 * Complies with Project Section 3.5.2: Commercial Data Security & Privacy
 */

export function sanitizeSensitiveText(text: string, enabled: boolean = true): string {
  if (!enabled || !text) return text;
  return String(text)
    // VN Phone numbers (+84 or 0 followed by 9-10 digits)
    .replace(/(\+84|0)\d{8,10}/g, '[SĐT ẨN DANH]')
    // Emails
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL ẨN DANH]')
    // Specific personal ID or sensitive tokens
    .replace(/\b(CCCD|CMND|MST cá nhân)\s*:\s*\d+/gi, '[ĐỊNH DANH ẨN]');
}
