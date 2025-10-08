import dayjs from 'dayjs';
import type React from 'react';
import type { DiscordEvent } from '../logic/discord';
import { P } from './Typography';
import './EventCard.css';

export interface EventCardProps {
  event: DiscordEvent;
}

/**
 * Display a single Discord event with time, title, location, and description.
 */
export function EventCard({ event }: EventCardProps): React.JSX.Element {
  const startTime = dayjs(event.start).format('h:mm A');
  const endTime = event.end ? dayjs(event.end).format('h:mm A') : null;
  const timeRange = endTime ? `${startTime} - ${endTime}` : startTime;

  return (
    <div className="event-card">
      <div className="event-card__time">{timeRange}</div>
      <h3 className="event-card__title">{event.name}</h3>
      {event.location && <div className="event-card__location">📍 {event.location}</div>}
      {event.desc && <P className="event-card__description">{event.desc}</P>}
    </div>
  );
}
