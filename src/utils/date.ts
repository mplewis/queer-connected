import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export function formatDate(date: string | Date, format = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format);
}

export function formatDateTime(date: string | Date): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

export function getRelativeTime(date: string | Date): string {
  return dayjs(date).fromNow();
}

export function isAfter(date1: string | Date, date2: string | Date): boolean {
  return dayjs(date1).isAfter(dayjs(date2));
}

export function isBefore(date1: string | Date, date2: string | Date): boolean {
  return dayjs(date1).isBefore(dayjs(date2));
}

export function addDays(date: string | Date, days: number): Date {
  return dayjs(date).add(days, 'day').toDate();
}

export function subtractDays(date: string | Date, days: number): Date {
  return dayjs(date).subtract(days, 'day').toDate();
}

export { dayjs };
