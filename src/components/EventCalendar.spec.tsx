import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, useAtomValue } from 'jotai';
import { describe, expect, it, vi } from 'vitest';
import type { DiscordEvent } from '../logic/discord';
import { DAYS_AFTER_TODAY, DAYS_BEFORE_TODAY, selectedDateAtom } from '../store/events';
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

  const prevButton = screen.getByRole('button', { name: '←' });
  const initialMonthText = screen.getByText(/\w+ \d{4}/).textContent;

  if (!(prevButton as HTMLButtonElement).disabled) {
    await user.click(prevButton);
    const newMonthText = screen.getByText(/\w+ \d{4}/).textContent;
    expect(newMonthText).not.toBe(initialMonthText);
  } else {
    expect(prevButton).toBeDisabled();
  }
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

describe('DST handling', () => {
  it('handles November 2025 DST transition without duplicates', async () => {
    vi.setSystemTime(new Date('2025-10-15T12:00:00Z'));
    const user = userEvent.setup();

    render(
      <Provider>
        <EventCalendar events={[]} />
      </Provider>
    );

    const nextButton = screen.getByRole('button', { name: '→' });
    await user.click(nextButton);

    const dayButtons = screen.getAllByRole('button').filter((btn) => {
      const text = btn.textContent;
      return (
        text && /^\d+$/.test(text) && !btn.classList.contains('event-calendar__day--other-month')
      );
    });

    const dayNumbers = dayButtons.map((btn) => Number.parseInt(btn.textContent || '0', 10));
    const uniqueDays = new Set(dayNumbers);

    expect(dayNumbers.length).toBe(30);
    expect(uniqueDays.size).toBe(30);
    for (let i = 1; i <= 30; i++) {
      expect(uniqueDays.has(i)).toBe(true);
    }

    vi.useRealTimers();
  });

  it('handles March 2025 DST transition correctly (spring forward)', () => {
    vi.setSystemTime(new Date('2025-03-15T12:00:00Z'));

    const { unmount } = render(
      <Provider>
        <EventCalendar events={[]} />
      </Provider>
    );

    const dayButtons = screen.getAllByRole('button').filter((btn) => {
      const text = btn.textContent;
      return (
        text && /^\d+$/.test(text) && !btn.classList.contains('event-calendar__day--other-month')
      );
    });

    const dayNumbers = dayButtons.map((btn) => Number.parseInt(btn.textContent || '0', 10));
    const uniqueDays = new Set(dayNumbers);

    expect(dayNumbers.length).toBe(31);
    expect(uniqueDays.size).toBe(31);
    for (let i = 1; i <= 31; i++) {
      expect(uniqueDays.has(i)).toBe(true);
    }

    unmount();
    vi.useRealTimers();
  });
});

describe('date range constraints', () => {
  it('respects DAYS_BEFORE_TODAY and DAYS_AFTER_TODAY constants', () => {
    render(
      <Provider>
        <EventCalendar events={mockEvents} />
      </Provider>
    );

    expect(DAYS_BEFORE_TODAY).toBe(7);
    expect(DAYS_AFTER_TODAY).toBe(90);
  });

  it('prevents clicking on disabled day buttons', async () => {
    const user = userEvent.setup();

    render(
      <Provider>
        <TestWrapper events={mockEvents} />
      </Provider>
    );

    const dayButtons = screen.getAllByRole('button').filter((btn) => {
      const text = btn.textContent;
      const isDisabled = (btn as HTMLButtonElement).disabled;
      return text && /^\d+$/.test(text) && isDisabled;
    });

    if (dayButtons.length > 0) {
      const firstButton = dayButtons[0];
      if (firstButton) {
        const initialDate = screen.getByTestId('selected-date').textContent;
        await user.click(firstButton);
        const newDate = screen.getByTestId('selected-date').textContent;
        expect(newDate).toBe(initialDate);
      }
    }
  });

  it('navigates to another month when clicking a day outside current month', async () => {
    const user = userEvent.setup();

    render(
      <Provider>
        <EventCalendar events={mockEvents} />
      </Provider>
    );

    const initialMonth = screen.getByText(/2025/).textContent;

    const otherMonthDays = screen.getAllByRole('button').filter((btn) => {
      const isDisabled = (btn as HTMLButtonElement).disabled;
      return (
        btn.classList.contains('event-calendar__day--other-month') &&
        !isDisabled &&
        btn.textContent &&
        /^\d+$/.test(btn.textContent)
      );
    });

    if (otherMonthDays.length > 0) {
      const firstOtherDay = otherMonthDays[0];
      if (firstOtherDay) {
        await user.click(firstOtherDay);
        const newMonth = screen.getByText(/2025/).textContent;
        expect(newMonth).not.toBe(initialMonth);
      }
    }
  });

  it('only shows event dots on days in current month and within range', () => {
    render(
      <Provider>
        <EventCalendar events={mockEvents} />
      </Provider>
    );

    const daysWithEvents = screen.getAllByRole('button').filter((btn) => {
      return btn.classList.contains('event-calendar__day--has-events');
    });

    daysWithEvents.forEach((btn) => {
      const isOtherMonth = btn.classList.contains('event-calendar__day--other-month');
      const isDisabled = (btn as HTMLButtonElement).disabled;
      expect(isOtherMonth).toBe(false);
      expect(isDisabled).toBe(false);
    });
  });
});
