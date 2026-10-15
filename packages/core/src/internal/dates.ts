// Calendar dates as `YYYY-MM-DD` strings, like `<input type="date">`. They're
// handled as UTC midnights, so time zones and daylight saving never shift a day.

/** A date as a UTC midnight, or null when the text isn't a real `YYYY-MM-DD` date. */
export function parseIso(text: string | null | undefined): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text ?? '');
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  // Rejects 2026-02-30 and friends, which Date would roll over.
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
}

export function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Today in the user's time zone, as `YYYY-MM-DD`. */
export function todayIso(): string {
  const now = new Date();
  return toIso(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}

/** The same day `months` later, or the month's last day when it's shorter (Jan 31 + 1 month = Feb 28). */
export function addMonths(date: Date, months: number): Date {
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(date.getUTCDate(), lastDay));
  return target;
}

export function startOfMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

/** The date clamped between min and max (either may be null). */
export function clamp(date: Date, min: Date | null, max: Date | null): Date {
  if (min && date < min) return min;
  if (max && date > max) return max;
  return date;
}

/** First day of the week for a language: 0 Sunday … 6 Saturday. */
export function firstDayOfWeek(lang: string): number {
  try {
    const locale = new Intl.Locale(lang || 'en-US') as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const info = locale.getWeekInfo?.() ?? locale.weekInfo;
    // Intl counts 1 Monday … 7 Sunday.
    if (info) return info.firstDay % 7;
  } catch {
    // An invalid language tag: fall through.
  }
  // Browsers without week info: Sunday in the US and Canada, Monday elsewhere.
  const region = (lang.split('-')[1] ?? (lang === 'en' || !lang ? 'US' : '')).toUpperCase();
  return ['US', 'CA', 'JP', 'BR', 'IL', 'IN'].includes(region) ? 0 : 1;
}

export function formatter(lang: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  try {
    return new Intl.DateTimeFormat(lang || undefined, { timeZone: 'UTC', ...options });
  } catch {
    return new Intl.DateTimeFormat(undefined, { timeZone: 'UTC', ...options });
  }
}

/** The short numeric format of a language, e.g. 14/10/2026 or 10/14/2026. */
export function formatShort(date: Date, lang: string): string {
  return formatter(lang, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

/** Order of day, month and year in the language's short format, and its separator. */
export function shortPattern(lang: string): { order: ('day' | 'month' | 'year')[]; separator: string } {
  const parts = formatter(lang, { day: '2-digit', month: '2-digit', year: 'numeric' }).formatToParts(new Date(Date.UTC(2026, 11, 31)));
  const order = parts.filter((p) => p.type === 'day' || p.type === 'month' || p.type === 'year').map((p) => p.type as 'day' | 'month' | 'year');
  const separator = parts.find((p) => p.type === 'literal')?.value.trim() || '/';
  return { order: order.length === 3 ? order : ['day', 'month', 'year'], separator };
}

/**
 * A typed date, in the language's order (14/10/2026, 10.14.26, 14-10-2026…) or
 * as `YYYY-MM-DD`. Any separator works. Two-digit years mean 20xx. Returns null
 * when it isn't a real date.
 */
export function parseTyped(text: string, lang: string): Date | null {
  const trimmed = text.trim();
  const iso = parseIso(trimmed);
  if (iso) return iso;
  const numbers = trimmed.split(/[^0-9]+/).filter(Boolean);
  if (numbers.length !== 3) return null;
  const { order } = shortPattern(lang);
  const value = Object.fromEntries(order.map((part, i) => [part, numbers[i]])) as Record<'day' | 'month' | 'year', string>;
  if (value.year.length !== 2 && value.year.length !== 4) return null;
  const year = value.year.length === 2 ? 2000 + Number(value.year) : Number(value.year);
  return parseIso(`${String(year).padStart(4, '0')}-${value.month.padStart(2, '0')}-${value.day.padStart(2, '0')}`);
}
