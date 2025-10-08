import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { CALENDAR_TIMEZONE } from '../constants';

// Configure dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Get the current date/time in configured timezone.
 * This ensures consistent behavior between server and client.
 */
export function nowAsLocal(): dayjs.Dayjs {
  return dayjs().tz(CALENDAR_TIMEZONE);
}

/**
 * Parse a date and convert it to configured timezone.
 */
export function dateAsLocal(date: string | Date | dayjs.Dayjs): dayjs.Dayjs {
  return dayjs(date).tz(CALENDAR_TIMEZONE);
}

export { dayjs };
