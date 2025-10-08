export interface CalendarDay {
  year: number;
  month: number;
  day: number;
  weekday: number;
  inMonth: boolean;
}

/**
 * Generate calendar grid for a given month and year.
 * Returns an array of days including padding days from adjacent months
 * to fill complete weeks (Sun-Sat). Works with UTC dates to avoid DST issues.
 */
export function getCalendarGridForMonth(targetYear: number, targetMonth: number): CalendarDay[] {
  const firstOfMonth = new Date(Date.UTC(targetYear, targetMonth - 1, 1));
  const lastDay = new Date(Date.UTC(targetYear, targetMonth, 0));

  const firstWeekday = firstOfMonth.getUTCDay();
  const lastWeekday = lastDay.getUTCDay();

  const firstCalendarDate = new Date(firstOfMonth);
  firstCalendarDate.setUTCDate(firstCalendarDate.getUTCDate() - firstWeekday);

  const daysToAdd = lastWeekday === 6 ? 0 : 6 - lastWeekday;
  const lastCalendarDate = new Date(lastDay);
  lastCalendarDate.setUTCDate(lastCalendarDate.getUTCDate() + daysToAdd);

  const days: CalendarDay[] = [];
  const current = new Date(firstCalendarDate);

  while (current <= lastCalendarDate) {
    const year = current.getUTCFullYear();
    const month = current.getUTCMonth() + 1;
    const day = current.getUTCDate();
    const weekday = current.getUTCDay();
    const inMonth = year === targetYear && month === targetMonth;
    days.push({ year, month, day, weekday, inMonth });
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return days;
}
