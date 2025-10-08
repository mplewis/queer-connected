import type { GuildScheduledEventRecurrenceRule } from 'discord.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { rrToDates } from './discord';

const EVERY_OTHER_SUNDAY: GuildScheduledEventRecurrenceRule = {
  get startAt() {
    return new Date(this.startTimestamp);
  },
  get endAt() {
    return this.endTimestamp ? new Date(this.endTimestamp) : null;
  },
  startTimestamp: 1737320400000,
  endTimestamp: null,
  frequency: 2,
  interval: 2,
  byWeekday: [6],
  byNWeekday: null,
  byMonth: null,
  byMonthDay: null,
  byYearDay: null,
  count: null,
};

const EVERY_OTHER_SUNDAY_WITH_END: GuildScheduledEventRecurrenceRule = {
  ...EVERY_OTHER_SUNDAY,
  get endAt() {
    return this.endTimestamp ? new Date(this.endTimestamp) : null;
  },
  endTimestamp: 1740949200000,
};

describe('rrToDates', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('converts a recurrence rule to a date generator', () => {
    expect(Array.from(rrToDates(EVERY_OTHER_SUNDAY).take(5))).toMatchInlineSnapshot(`
      [
        2025-01-19T21:00:00.000Z,
        2025-02-02T21:00:00.000Z,
        2025-02-16T21:00:00.000Z,
        2025-03-02T21:00:00.000Z,
        2025-03-16T20:00:00.000Z,
      ]
    `);

    expect(Array.from(rrToDates(EVERY_OTHER_SUNDAY_WITH_END).take(5))).toMatchInlineSnapshot(`
      [
        2025-01-19T21:00:00.000Z,
        2025-02-02T21:00:00.000Z,
        2025-02-16T21:00:00.000Z,
        2025-03-02T21:00:00.000Z,
      ]
    `);
  });
});
