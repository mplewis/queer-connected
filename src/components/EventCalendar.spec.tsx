import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, useAtomValue } from 'jotai';
import { expect, it } from 'vitest';
import type { DiscordEvent } from '../logic/discord';
import { selectedDateAtom } from '../store/events';
import { EventCalendar } from './EventCalendar';

const mockEvents: DiscordEvent[] = [
  {
    guildID: 'test-guild',
    name: 'Event on 15th',
    desc: 'Description',
    start: new Date('2025-01-15T18:00:00Z'),
    end: new Date('2025-01-15T20:00:00Z'),
    location: 'Location',
  },
  {
    guildID: 'test-guild',
    name: 'Event on 20th',
    desc: 'Description',
    start: new Date('2025-01-20T18:00:00Z'),
    end: new Date('2025-01-20T20:00:00Z'),
    location: 'Location',
  },
];

function TestWrapper({ events }: { events: DiscordEvent[] }) {
  const selectedDate = useAtomValue(selectedDateAtom);
  return (
    <div>
      <EventCalendar events={events} />
      <div data-testid="selected-date">{selectedDate.toISOString()}</div>
    </div>
  );
}

it('displays month and year header', () => {
  render(
    <Provider>
      <EventCalendar events={mockEvents} />
    </Provider>
  );
  expect(screen.getByText(/2025/)).toBeInTheDocument();
});

it('displays weekday headers', () => {
  render(
    <Provider>
      <EventCalendar events={mockEvents} />
    </Provider>
  );
  expect(screen.getByText('Sun')).toBeInTheDocument();
  expect(screen.getByText('Mon')).toBeInTheDocument();
  expect(screen.getByText('Tue')).toBeInTheDocument();
  expect(screen.getByText('Wed')).toBeInTheDocument();
  expect(screen.getByText('Thu')).toBeInTheDocument();
  expect(screen.getByText('Fri')).toBeInTheDocument();
  expect(screen.getByText('Sat')).toBeInTheDocument();
});

it('renders calendar days as buttons', () => {
  render(
    <Provider>
      <EventCalendar events={mockEvents} />
    </Provider>
  );
  const dayButtons = screen.getAllByRole('button').filter((btn) => {
    const text = btn.textContent;
    return text && /^\d+$/.test(text);
  });
  expect(dayButtons.length).toBeGreaterThan(28);
});

it('selects a date when clicking a day', async () => {
  const user = userEvent.setup();
  render(
    <Provider>
      <TestWrapper events={mockEvents} />
    </Provider>
  );

  const dayButtons = screen.getAllByRole('button').filter((btn) => btn.textContent === '15');
  const firstButton = dayButtons[0];
  if (firstButton) {
    await user.click(firstButton);
    const selectedDate = new Date(screen.getByTestId('selected-date').textContent || '');
    expect(selectedDate.getDate()).toBe(15);
  }
});

it('navigates to previous month', async () => {
  const user = userEvent.setup();
  render(
    <Provider>
      <EventCalendar events={mockEvents} />
    </Provider>
  );

  const initialMonthText = screen.getByText(/2025/).textContent;
  const prevButton = screen.getByRole('button', { name: '←' });
  await user.click(prevButton);

  const newMonthText = screen.getByText(/2025/).textContent;
  expect(newMonthText).not.toBe(initialMonthText);
});

it('navigates to next month', async () => {
  const user = userEvent.setup();
  render(
    <Provider>
      <EventCalendar events={mockEvents} />
    </Provider>
  );

  const initialMonthText = screen.getByText(/2025/).textContent;
  const nextButton = screen.getByRole('button', { name: '→' });
  await user.click(nextButton);

  const newMonthText = screen.getByText(/2025/).textContent;
  expect(newMonthText).not.toBe(initialMonthText);
});

it('jumps to today when clicking month header', async () => {
  const user = userEvent.setup();
  const today = new Date();

  render(
    <Provider>
      <TestWrapper events={mockEvents} />
    </Provider>
  );

  const monthHeader = screen.getByRole('button', { name: /2025/ });
  await user.click(monthHeader);

  const selectedDate = new Date(screen.getByTestId('selected-date').textContent || '');
  expect(selectedDate.getDate()).toBe(today.getDate());
  expect(selectedDate.getMonth()).toBe(today.getMonth());
});
