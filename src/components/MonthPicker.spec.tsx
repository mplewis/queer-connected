import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, useAtomValue } from 'jotai';
import { expect, it } from 'vitest';
import type { DiscordEvent } from '../logic/discord';
import { currentMonthAtom, selectedDateAtom } from '../store/events';
import { MonthPicker } from './MonthPicker';

const mockEvents: DiscordEvent[] = [
  {
    guildID: 'test-guild',
    name: 'Event 1',
    desc: 'Description 1',
    start: new Date('2025-02-15T18:00:00Z'),
    end: new Date('2025-02-15T20:00:00Z'),
    location: 'Location 1',
  },
  {
    guildID: 'test-guild',
    name: 'Event 2',
    desc: 'Description 2',
    start: new Date('2025-03-20T18:00:00Z'),
    end: new Date('2025-03-20T20:00:00Z'),
    location: 'Location 2',
  },
];

function TestWrapper({ events }: { events: DiscordEvent[] }) {
  const currentMonth = useAtomValue(currentMonthAtom);
  const selectedDate = useAtomValue(selectedDateAtom);
  return (
    <div>
      <MonthPicker events={events} />
      <div data-testid="current-month">{currentMonth.toISOString()}</div>
      <div data-testid="selected-date">{selectedDate.toISOString()}</div>
    </div>
  );
}

it('displays current month and year', () => {
  render(
    <Provider>
      <MonthPicker events={mockEvents} />
    </Provider>
  );
  const monthText = screen.getByRole('button', { name: /2025/i });
  expect(monthText).toBeInTheDocument();
});

it('shows previous and next navigation buttons', () => {
  render(
    <Provider>
      <MonthPicker events={mockEvents} />
    </Provider>
  );
  const buttons = screen.getAllByRole('button');
  expect(buttons.length).toBeGreaterThanOrEqual(3);
});

it('navigates to previous month when clicking previous button', async () => {
  const user = userEvent.setup();
  render(
    <Provider>
      <TestWrapper events={mockEvents} />
    </Provider>
  );

  const initialMonth = screen.getByTestId('current-month').textContent;
  const prevButton = screen.getAllByRole('button')[0];
  if (prevButton) {
    await user.click(prevButton);

    const newMonth = screen.getByTestId('current-month').textContent;
    expect(newMonth).not.toBe(initialMonth);
  }
});

it('navigates to next month when clicking next button', async () => {
  const user = userEvent.setup();
  render(
    <Provider>
      <TestWrapper events={mockEvents} />
    </Provider>
  );

  const initialMonth = screen.getByTestId('current-month').textContent;
  const buttons = screen.getAllByRole('button');
  const nextButton = buttons[buttons.length - 1];
  if (nextButton) {
    await user.click(nextButton);

    const newMonth = screen.getByTestId('current-month').textContent;
    expect(newMonth).not.toBe(initialMonth);
  }
});

it('jumps to today when clicking month label', async () => {
  const user = userEvent.setup();
  const today = new Date();

  render(
    <Provider>
      <TestWrapper events={mockEvents} />
    </Provider>
  );

  const monthLabel = screen.getByRole('button', { name: /2025/i });
  await user.click(monthLabel);

  const selectedDate = new Date(screen.getByTestId('selected-date').textContent || '');
  expect(selectedDate.getDate()).toBe(today.getDate());
  expect(selectedDate.getMonth()).toBe(today.getMonth());
  expect(selectedDate.getFullYear()).toBe(today.getFullYear());
});
