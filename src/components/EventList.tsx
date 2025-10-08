import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import type React from 'react';
import { useEffect, useRef } from 'react';
import type { DiscordEvent } from '../logic/discord';
import { selectedDateAtom } from '../store/events';
import { EventCard } from './EventCard';
import { Stack } from './Stack';
import { H2 } from './Typography';
import './EventList.css';

export interface EventListProps {
  events: DiscordEvent[];
}

/**
 * Display a scrollable list of events, filtered by the selected date.
 * Auto-scrolls to the selected date when it changes.
 */
export function EventList({ events }: EventListProps): React.JSX.Element {
  const selectedDate = useAtomValue(selectedDateAtom);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedDateKey = dayjs(selectedDate).format('YYYY-MM-DD');

  const eventsByDate = events.reduce(
    (acc, event) => {
      const dateKey = dayjs(event.start).format('YYYY-MM-DD');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    },
    {} as Record<string, DiscordEvent[]>
  );

  const sortedDates = Object.keys(eventsByDate).sort();

  useEffect(() => {
    const element = document.getElementById(`date-${selectedDateKey}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedDateKey]);

  return (
    <div className="event-list" ref={listRef}>
      <Stack gap="lg">
        {sortedDates.length === 0 ? (
          <div className="event-list__empty">No events scheduled</div>
        ) : (
          sortedDates.map((dateKey) => {
            const date = dayjs(dateKey);
            const isSelected = dateKey === selectedDateKey;

            return (
              <div
                key={dateKey}
                id={`date-${dateKey}`}
                className={`event-list__date-section ${isSelected ? 'event-list__date-section--selected' : ''}`}
              >
                <H2 className="event-list__date-header">{date.format('dddd, MMMM D, YYYY')}</H2>
                <Stack gap="md">
                  {eventsByDate[dateKey]?.map((event) => (
                    <EventCard
                      key={`${event.guildID}-${event.name}-${event.start.getTime()}`}
                      event={event}
                    />
                  ))}
                </Stack>
              </div>
            );
          })
        )}
      </Stack>
    </div>
  );
}
