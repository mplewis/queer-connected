import { Provider } from 'jotai';
import type React from 'react';
import type { PublicEvent } from '../logic/discord';
import { Button } from './Button';
import { Container } from './Container';
import { EventCalendar } from './EventCalendar';
import { EventList } from './EventList';
import { Responsive } from './Responsive';
import { Stack } from './Stack';
import './EventsView.css';

export interface EventsViewProps {
  events: Array<PublicEvent & { icsDataUri?: string }>;
}

/**
 * Main events view component that combines calendar and event list.
 * Responsive layout: 1/3 calendar + 2/3 list on desktop, stacked on mobile.
 */
export function EventsView({ events }: EventsViewProps): React.JSX.Element {
  return (
    <Provider>
      <Container size="lg" className="events-view">
        <Stack direction="responsive" gap="lg" className="events-view__layout">
          <div className="events-view__sidebar">
            <Responsive hide="mobile">
              <EventCalendar events={events} />
            </Responsive>
            <div className="events-view__subscribe">
              <Button
                variant="ghost"
                prefix={{ icon: 'solar:calendar-add-bold' }}
                href="/events.ics"
              >
                Subscribe to Calendar
              </Button>
            </div>
          </div>

          <EventList events={events} />
        </Stack>
      </Container>
    </Provider>
  );
}
