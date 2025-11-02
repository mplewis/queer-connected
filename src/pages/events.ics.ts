import type { APIRoute } from 'astro';
import { DISCORD_GUILD_ID } from '../config/env';
import { featureEnabled } from '../config/features';
import { getScheduledEventsForGuild } from '../logic/discord';
import { createCalendar } from '../logic/ical';
import { DAYS_AFTER_TODAY, DAYS_BEFORE_TODAY } from '../store/events';
import { dateAsLocal, nowAsLocal } from '../utils/timezone';

/**
 * Generates a static iCal feed file at build time containing all events.
 * This endpoint can be subscribed to in calendar applications.
 */
export const GET: APIRoute = async () => {
  if (!featureEnabled('events')) {
    return new Response(null, { status: 404 });
  }
  const startDate = nowAsLocal().subtract(DAYS_BEFORE_TODAY, 'day').startOf('day');
  const endDate = nowAsLocal().add(DAYS_AFTER_TODAY, 'day').endOf('day');

  const allEvents = await getScheduledEventsForGuild(DISCORD_GUILD_ID, {
    untilDate: endDate.toDate(),
  });

  const filteredEvents = allEvents.filter((event) => {
    const eventDate = dateAsLocal(event.start);
    return eventDate.isAfter(startDate) && eventDate.isBefore(endDate);
  });

  const calendar = createCalendar(filteredEvents);

  return new Response(calendar.toString(), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="events.ics"',
    },
  });
};

export const prerender = true;
