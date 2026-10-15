import { describe, expect, it } from 'vitest';
import { addMonths, firstDayOfWeek, formatShort, parseIso, parseTyped, shortPattern, toIso } from './dates.js';

describe('dates', () => {
  it('reads only real YYYY-MM-DD dates', () => {
    expect(toIso(parseIso('2026-02-28')!)).toBe('2026-02-28');
    expect(parseIso('2026-02-30')).toBeNull();
    expect(parseIso('2026-2-3')).toBeNull();
    expect(parseIso('')).toBeNull();
    expect(toIso(parseIso('2028-02-29')!)).toBe('2028-02-29');
  });

  it('adds months, keeping the day when it exists', () => {
    expect(toIso(addMonths(parseIso('2026-01-31')!, 1))).toBe('2026-02-28');
    expect(toIso(addMonths(parseIso('2026-03-15')!, -14))).toBe('2025-01-15');
  });

  it('knows the first day of the week', () => {
    expect(firstDayOfWeek('en-US')).toBe(0);
    expect(firstDayOfWeek('it-IT')).toBe(1);
    expect(firstDayOfWeek('de')).toBe(1);
  });

  it('formats and reads dates in the language order', () => {
    const date = parseIso('2026-10-14')!;
    expect(formatShort(date, 'it')).toBe('14/10/2026');
    expect(formatShort(date, 'en-US')).toBe('10/14/2026');
    expect(shortPattern('de')).toEqual({ order: ['day', 'month', 'year'], separator: '.' });
    expect(shortPattern('ja').order).toEqual(['year', 'month', 'day']);

    expect(toIso(parseTyped('14/10/2026', 'it')!)).toBe('2026-10-14');
    expect(toIso(parseTyped('10/14/2026', 'en-US')!)).toBe('2026-10-14');
    expect(toIso(parseTyped('14.10.26', 'de')!)).toBe('2026-10-14');
    expect(toIso(parseTyped('1-2-2026', 'it')!)).toBe('2026-02-01');
    expect(toIso(parseTyped('2026-10-14', 'it')!)).toBe('2026-10-14');
  });

  it('rejects text that is not a date', () => {
    expect(parseTyped('31/02/2026', 'it')).toBeNull();
    expect(parseTyped('14/10', 'it')).toBeNull();
    expect(parseTyped('tomorrow', 'it')).toBeNull();
    expect(parseTyped('14/10/202', 'it')).toBeNull();
  });
});
