import { render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import { expect, it } from 'vitest';
import type { DiscordEvent } from '../logic/discord';
import { EventList } from './EventList';

const mockEvents: DiscordEvent[] = [
  {
    guildID: 'test-guild',
    name: 'Event on Jan 15',
    desc: 'First event',
    start: new Date('2025-01-15T18:00:00Z'),
    end: new Date('2025-01-15T20:00:00Z'),
    location: 'Location 1',
  },
  {
    guildID: 'test-guild',
    name: 'Event on Jan 20',
    desc: 'Second event',
    start: new Date('2025-01-20T18:00:00Z'),
    end: new Date('2025-01-20T20:00:00Z'),
    location: 'Location 2',
  },
  {
    guildID: 'test-guild',
    name: 'Another event on Jan 15',
    desc: 'Same day as first',
    start: new Date('2025-01-15T14:00:00Z'),
    end: new Date('2025-01-15T16:00:00Z'),
    location: 'Location 3',
  },
];

it('renders all events', () => {
  render(
    <Provider>
      <EventList events={mockEvents} />
    </Provider>
  );
  expect(screen.getByText('Event on Jan 15')).toBeInTheDocument();
  expect(screen.getByText('Event on Jan 20')).toBeInTheDocument();
  expect(screen.getByText('Another event on Jan 15')).toBeInTheDocument();
});

it('groups events by date', () => {
  render(
    <Provider>
      <EventList events={mockEvents} />
    </Provider>
  );
  const dateHeaders = screen.getAllByRole('heading', { level: 2 });
  expect(dateHeaders.length).toBe(2);
});

it('renders date headers with full date format', () => {
  render(
    <Provider>
      <EventList events={mockEvents} />
    </Provider>
  );
  expect(screen.getByText(/January 15, 2025/)).toBeInTheDocument();
  expect(screen.getByText(/January 20, 2025/)).toBeInTheDocument();
});

it('displays empty state when no events', () => {
  render(
    <Provider>
      <EventList events={[]} />
    </Provider>
  );
  expect(screen.getByText('No events scheduled')).toBeInTheDocument();
});

it('renders multiple events on the same day', () => {
  render(
    <Provider>
      <EventList events={mockEvents} />
    </Provider>
  );
  expect(screen.getByText('Event on Jan 15')).toBeInTheDocument();
  expect(screen.getByText('Another event on Jan 15')).toBeInTheDocument();
});

it('sorts events by date', () => {
  const event1 = mockEvents[0];
  const event2 = mockEvents[1];
  const event3 = mockEvents[2];
  if (!event1 || !event2 || !event3) return;

  render(
    <Provider>
      <EventList events={[event2, event1, event3]} />
    </Provider>
  );
  const dateHeaders = screen.getAllByRole('heading', { level: 2 });
  expect(dateHeaders[0]?.textContent).toMatch(/January 15/);
  expect(dateHeaders[1]?.textContent).toMatch(/January 20/);
});

it('assigns unique IDs to date sections for scrolling', () => {
  const { container } = render(
    <Provider>
      <EventList events={mockEvents} />
    </Provider>
  );
  const jan15Section = container.querySelector('#date-2025-01-15');
  const jan20Section = container.querySelector('#date-2025-01-20');
  expect(jan15Section).toBeInTheDocument();
  expect(jan20Section).toBeInTheDocument();
});
