import ical, { type ICalCalendar } from 'ical-generator';
import { CALENDAR_DESCRIPTION, CALENDAR_NAME, CALENDAR_TIMEZONE } from '../constants';
import type { DiscordEvent } from './discord';

/**
 * Creates an iCal calendar feed containing all provided events.
 * This function is for server-side/build-time use only.
 */
export function createCalendar(events: DiscordEvent[]): ICalCalendar {
  const calendar = ical({
    name: CALENDAR_NAME,
    description: CALENDAR_DESCRIPTION,
    timezone: CALENDAR_TIMEZONE,
  });

  for (const event of events) {
    calendar.createEvent({
      start: event.start,
      ...(event.end && { end: event.end }),
      summary: event.name,
      ...(event.desc && { description: event.desc }),
      ...(event.location && { location: event.location }),
      ...(event.location && { url: event.location }),
    });
  }

  return calendar;
}

/**
 * Generates an ICS file content string for a single event.
 * This function is for server-side/build-time use only.
 */
export function createEventICS(event: DiscordEvent): string {
  const calendar = ical({
    name: event.name,
    timezone: CALENDAR_TIMEZONE,
  });

  calendar.createEvent({
    start: event.start,
    ...(event.end && { end: event.end }),
    summary: event.name,
    ...(event.desc && { description: event.desc }),
    ...(event.location && { location: event.location }),
    ...(event.location && { url: event.location }),
  });

  return calendar.toString();
}
