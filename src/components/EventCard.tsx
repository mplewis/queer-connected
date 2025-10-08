import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type React from 'react';
import type { PublicEvent } from '../logic/discord';
import { Button } from './Button';
import { P } from './Typography';
import './EventCard.css';

dayjs.extend(utc);

export interface EventCardProps {
  event: PublicEvent;
  icsDataUri?: string;
}

/**
 * Formats a date for Google Calendar URL.
 */
function toGcalDate(date: Date): string {
  return dayjs(date).utc().format('YYYYMMDDTHHmmss[Z]');
}

/**
 * Generates a Google Calendar event URL.
 */
function gcalLink(event: PublicEvent): string {
  const dates = `${toGcalDate(event.start)}/${toGcalDate(event.end ?? event.start)}`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    dates,
    text: event.name,
    ...(event.desc && { details: event.desc }),
    ...(event.location && { location: event.location }),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Display a single Discord event with time, title, location, and description.
 */
export function EventCard({ event, icsDataUri }: EventCardProps): React.JSX.Element {
  const startTime = dayjs(event.start).format('h:mm A');
  const endTime = event.end ? dayjs(event.end).format('h:mm A') : null;
  const timeRange = endTime ? `${startTime} - ${endTime}` : startTime;
  const mapsUrl = event.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`
    : undefined;
  const googleCalUrl = gcalLink(event);

  return (
    <div className="event-card">
      <div className="event-card__time">{timeRange}</div>
      <div className="event-card__title">{event.name}</div>
      {event.location && <div className="event-card__location">📍 {event.location}</div>}
      {event.desc && <P className="event-card__description">{event.desc}</P>}
      <div className="event-card__actions">
        {mapsUrl && (
          <Button
            variant="ghost"
            size="sm"
            iconPrefix="🗺️"
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Directions
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          iconPrefix="📅"
          href={googleCalUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Add to GCal
        </Button>
        {icsDataUri && (
          <Button
            variant="ghost"
            size="sm"
            iconPrefix="📅"
            href={icsDataUri}
            download={`${event.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`}
          >
            Add to iCal
          </Button>
        )}
      </div>
    </div>
  );
}
