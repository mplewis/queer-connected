import { useAtomValue } from 'jotai';
import type React from 'react';
import { useEffect, useRef } from 'react';
import type { PublicEvent } from '../logic/discord';
import { selectedDateAtom } from '../store/events';
import { dateAsLocal } from '../utils/timezone';
import { EventCard } from './EventCard';
import { Stack } from './Stack';
import { H2 } from './Typography';
import './EventList.css';

export interface EventListProps {
  events: Array<PublicEvent & { icsDataUri?: string }>;
}

/**
 * Find the target date to scroll to: the selected date if it has events,
 * otherwise the next date with events, or the last date if selected date is after all events.
 */
function findTargetDate(
  selectedKey: string,
  dates: string[],
  eventsMap: Record<string, Array<PublicEvent & { icsDataUri?: string }>>
): string | null {
  if (eventsMap[selectedKey]) return selectedKey;

  const nextDate = dates.find((date) => date >= selectedKey);
  if (nextDate) return nextDate;

  if (dates.length > 0) {
    const lastDate = dates[dates.length - 1];
    if (lastDate) return lastDate;
  }

  return null;
}

/**
 * Display a scrollable list of events, filtered by the selected date.
 * Auto-scrolls to the selected date when it changes, or to the next event if no events on that date.
 */
export function EventList({ events }: EventListProps): React.JSX.Element {
  const selectedDate = useAtomValue(selectedDateAtom);
  const listRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);
  const selectedDateKey = dateAsLocal(selectedDate).format('YYYY-MM-DD');

  const eventsByDate = events.reduce(
    (acc, event) => {
      const dateKey = dateAsLocal(event.start).format('YYYY-MM-DD');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    },
    {} as Record<string, Array<PublicEvent & { icsDataUri?: string }>>
  );

  const sortedDates = Object.keys(eventsByDate).sort();

  useEffect(() => {
    // Skip scrolling on initial load
    if (!hasScrolledRef.current) {
      hasScrolledRef.current = true;
      return;
    }

    const targetDateKey = findTargetDate(selectedDateKey, sortedDates, eventsByDate);
    if (targetDateKey) {
      const element = document.getElementById(`date-${targetDateKey}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedDateKey, eventsByDate, sortedDates]);

  return (
    <div className="event-list" ref={listRef}>
      <Stack gap="lg">
        {sortedDates.length === 0 ? (
          <div className="event-list__empty">No events scheduled</div>
        ) : (
          sortedDates.map((dateKey) => {
            const date = dateAsLocal(dateKey);

            return (
              <div key={dateKey} id={`date-${dateKey}`} className="event-list__date-section">
                <H2 className="event-list__date-header">{date.format('dddd, MMMM D, YYYY')}</H2>
                <Stack gap="md">
                  {eventsByDate[dateKey]?.map((event) => (
                    <EventCard
                      key={`${event.name}-${event.start.getTime()}`}
                      event={event}
                      {...(event.icsDataUri && { icsDataUri: event.icsDataUri })}
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
