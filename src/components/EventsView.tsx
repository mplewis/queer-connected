import { Provider } from 'jotai';
import type React from 'react';
import type { DiscordEvent } from '../logic/discord';
import { Container } from './Container';
import { EventCalendar } from './EventCalendar';
import { EventList } from './EventList';
import { Responsive } from './Responsive';
import { Stack } from './Stack';
import './EventsView.css';

export interface EventsViewProps {
  events: DiscordEvent[];
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
          <Responsive hide="mobile" className="events-view__calendar">
            <EventCalendar events={events} />
          </Responsive>

          <EventList events={events} />
        </Stack>
      </Container>
    </Provider>
  );
}
