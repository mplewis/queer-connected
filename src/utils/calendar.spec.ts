import { describe, expect, it, vi } from 'vitest';
import { getCalendarGridForMonth } from './calendar';

describe('getCalendarGridForMonth', () => {
  it('generates correct number of days for November 2025', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 10, 15));

    const days = getCalendarGridForMonth(2025, 11);

    expect(days.length).toBeGreaterThanOrEqual(35);
    expect(days.length).toBeLessThanOrEqual(42);

    const novemberDays = days.filter((d) => d.inMonth);

    expect(novemberDays.length).toBe(30);

    vi.useRealTimers();
  });

  it('handles DST transition in November 2025 without duplicates', () => {
    const days = getCalendarGridForMonth(2025, 11);
    const dayNumbers = days.map((d) => d.day);

    const counts = new Map<number, number>();
    dayNumbers.forEach((d) => {
      counts.set(d, (counts.get(d) || 0) + 1);
    });

    const duplicates = Array.from(counts.entries()).filter(([_, count]) => count > 2);

    expect(
      duplicates.length,
      `Found duplicates: ${duplicates.map(([day]) => day).join(', ')}`
    ).toBe(0);
  });

  it('handles all months correctly for 10 years (2025-2035)', () => {
    const daysInMonth = (year: number, month: number): number => {
      return new Date(year, month, 0).getDate();
    };

    for (let year = 2025; year <= 2035; year++) {
      for (let month = 1; month <= 12; month++) {
        const days = getCalendarGridForMonth(year, month);
        const dayNumbers = days.map((d) => d.day);
        const expectedDays = daysInMonth(year, month);

        const monthDays = dayNumbers.filter((d) => d >= 1 && d <= expectedDays);
        const uniqueMonthDays = new Set(monthDays);

        expect(
          uniqueMonthDays.size,
          `${year}-${month} should have ${expectedDays} unique days`
        ).toBe(expectedDays);

        for (let i = 1; i <= expectedDays; i++) {
          expect(uniqueMonthDays.has(i), `${year}-${month} should contain day ${i}`).toBe(true);
        }
      }
    }
  });

  it('starts each week on Sunday (weekday 0)', () => {
    const days = getCalendarGridForMonth(2025, 11);
    expect(days[0]?.weekday).toBe(0);
  });

  it('ends each week on Saturday (weekday 6)', () => {
    const days = getCalendarGridForMonth(2025, 11);
    expect(days[days.length - 1]?.weekday).toBe(6);
  });

  it('generates complete weeks (divisible by 7)', () => {
    for (let month = 1; month <= 12; month++) {
      const days = getCalendarGridForMonth(2025, month);
      expect(days.length % 7, `Month ${month} should have complete weeks`).toBe(0);
    }
  });
});
