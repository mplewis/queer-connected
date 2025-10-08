import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type React from 'react';
import type { PublicEvent } from '../logic/discord';
import { dateAsLocal } from '../utils/timezone';
import { Button } from './Button';
import { P } from './Typography';
import './EventCard.css';
import { Icon } from '@iconify/react';

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
  const startTime = dateAsLocal(event.start).format('h:mm A');
  const endTime = event.end ? dateAsLocal(event.end).format('h:mm A') : null;
  const timeRange = endTime ? `${startTime} - ${endTime}` : startTime;
  const mapsUrl = event.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`
    : undefined;
  const googleCalUrl = gcalLink(event);

  return (
    <div className="event-card">
      <div className="event-card__title">{event.name}</div>
      <div className="event-card__time">{timeRange}</div>
      {event.location && (
        <div className="event-card__location">
          <Icon
            icon="solar:point-on-map-perspective-bold"
            style={{ verticalAlign: 'middle', marginRight: '0.3rem' }}
          />
          {event.location}
        </div>
      )}
      {event.desc && <P className="event-card__description">{event.desc}</P>}
      <div className="event-card__actions">
        {mapsUrl && (
          <Button
            variant="ghost"
            size="sm"
            prefix={{ icon: 'solar:map-arrow-up-bold' }}
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
          prefix={{ icon: 'cib:google' }}
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
            prefix={{ icon: 'cib:apple' }}
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
