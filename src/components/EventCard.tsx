import dayjs from 'dayjs';
import type React from 'react';
import type { PublicEvent } from '../logic/discord';
import { Button } from './Button';
import { P } from './Typography';
import './EventCard.css';

export interface EventCardProps {
  event: PublicEvent;
  icsDataUri?: string;
}

/**
 * Display a single Discord event with time, title, location, and description.
 */
export function EventCard({ event, icsDataUri }: EventCardProps): React.JSX.Element {
  const startTime = dayjs(event.start).format('h:mm A');
  const endTime = event.end ? dayjs(event.end).format('h:mm A') : null;
  const timeRange = endTime ? `${startTime} - ${endTime}` : startTime;

  const handleDownload = () => {
    if (!icsDataUri) return;
    const link = document.createElement('a');
    link.href = icsDataUri;
    link.download = `${event.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="event-card">
      <div className="event-card__time">{timeRange}</div>
      <div className="event-card__title">{event.name}</div>
      {event.location && <div className="event-card__location">📍 {event.location}</div>}
      {event.desc && <P className="event-card__description">{event.desc}</P>}
      {icsDataUri && (
        <Button
          variant="ghost"
          size="sm"
          iconPrefix="📅"
          onClick={handleDownload}
          className="event-card__download"
        >
          Add to Apple Calendar
        </Button>
      )}
    </div>
  );
}
