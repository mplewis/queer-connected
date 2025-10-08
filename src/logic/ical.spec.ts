import { describe, expect, it } from 'vitest';
import type { DiscordEvent } from './discord';
import { createCalendar, createEventICS } from './ical';

const mockEvent: DiscordEvent = {
  guildID: 'test-guild',
  name: 'Test Event',
  desc: 'Test Description',
  location: 'https://example.com',
  start: new Date('2025-01-15T18:00:00Z'),
  end: new Date('2025-01-15T20:00:00Z'),
};

/**
 * Normalizes ICS string by removing non-deterministic fields (UID, DTSTAMP).
 */
function normalizeICS(ics: string): string {
  return ics.replace(/UID:.+$/gm, 'UID:NORMALIZED').replace(/DTSTAMP:.+$/gm, 'DTSTAMP:NORMALIZED');
}

describe('createCalendar', () => {
  it('creates calendar with single event', () => {
    const calendar = createCalendar([mockEvent]);
    const icsString = normalizeICS(calendar.toString());

    expect(icsString).toMatchInlineSnapshot(`
      "BEGIN:VCALENDAR
      VERSION:2.0
      PRODID:-//sebbo.net//ical-generator//EN
      NAME:Queer & Connected Events
      X-WR-CALNAME:Queer & Connected Events
      X-WR-CALDESC:Events from the Queer & Connected community
      TIMEZONE-ID:America/Denver
      X-WR-TIMEZONE:America/Denver
      BEGIN:VEVENT
      UID:NORMALIZED
      SEQUENCE:0
      DTSTAMP:NORMALIZED
      DTSTART:20250115T110000
      DTEND:20250115T130000
      SUMMARY:Test Event
      LOCATION:https://example.com
      DESCRIPTION:Test Description
      URL;VALUE=URI:https://example.com
      END:VEVENT
      END:VCALENDAR"
    `);
  });

  it('creates calendar with multiple events', () => {
    const event2: DiscordEvent = {
      ...mockEvent,
      name: 'Second Event',
      start: new Date('2025-01-16T18:00:00Z'),
      end: new Date('2025-01-16T20:00:00Z'),
    };

    const calendar = createCalendar([mockEvent, event2]);
    const icsString = normalizeICS(calendar.toString());

    expect(icsString).toMatchInlineSnapshot(`
      "BEGIN:VCALENDAR
      VERSION:2.0
      PRODID:-//sebbo.net//ical-generator//EN
      NAME:Queer & Connected Events
      X-WR-CALNAME:Queer & Connected Events
      X-WR-CALDESC:Events from the Queer & Connected community
      TIMEZONE-ID:America/Denver
      X-WR-TIMEZONE:America/Denver
      BEGIN:VEVENT
      UID:NORMALIZED
      SEQUENCE:0
      DTSTAMP:NORMALIZED
      DTSTART:20250115T110000
      DTEND:20250115T130000
      SUMMARY:Test Event
      LOCATION:https://example.com
      DESCRIPTION:Test Description
      URL;VALUE=URI:https://example.com
      END:VEVENT
      BEGIN:VEVENT
      UID:NORMALIZED
      SEQUENCE:0
      DTSTAMP:NORMALIZED
      DTSTART:20250116T110000
      DTEND:20250116T130000
      SUMMARY:Second Event
      LOCATION:https://example.com
      DESCRIPTION:Test Description
      URL;VALUE=URI:https://example.com
      END:VEVENT
      END:VCALENDAR"
    `);
  });

  it('creates calendar with empty events array', () => {
    const calendar = createCalendar([]);
    const icsString = normalizeICS(calendar.toString());

    expect(icsString).toMatchInlineSnapshot(`
      "BEGIN:VCALENDAR
      VERSION:2.0
      PRODID:-//sebbo.net//ical-generator//EN
      NAME:Queer & Connected Events
      X-WR-CALNAME:Queer & Connected Events
      X-WR-CALDESC:Events from the Queer & Connected community
      TIMEZONE-ID:America/Denver
      X-WR-TIMEZONE:America/Denver
      END:VCALENDAR"
    `);
  });

  it('handles event without optional fields', () => {
    const minimalEvent: DiscordEvent = {
      guildID: 'test-guild',
      name: 'Minimal Event',
      desc: undefined,
      location: undefined,
      start: new Date('2025-01-15T18:00:00Z'),
      end: undefined,
    };

    const calendar = createCalendar([minimalEvent]);
    const icsString = normalizeICS(calendar.toString());

    expect(icsString).toMatchInlineSnapshot(`
      "BEGIN:VCALENDAR
      VERSION:2.0
      PRODID:-//sebbo.net//ical-generator//EN
      NAME:Queer & Connected Events
      X-WR-CALNAME:Queer & Connected Events
      X-WR-CALDESC:Events from the Queer & Connected community
      TIMEZONE-ID:America/Denver
      X-WR-TIMEZONE:America/Denver
      BEGIN:VEVENT
      UID:NORMALIZED
      SEQUENCE:0
      DTSTAMP:NORMALIZED
      DTSTART:20250115T110000
      SUMMARY:Minimal Event
      END:VEVENT
      END:VCALENDAR"
    `);
  });
});

describe('createEventICS', () => {
  it('creates ICS string for single event', () => {
    const icsString = normalizeICS(createEventICS(mockEvent));

    expect(icsString).toMatchInlineSnapshot(`
      "BEGIN:VCALENDAR
      VERSION:2.0
      PRODID:-//sebbo.net//ical-generator//EN
      NAME:Test Event
      X-WR-CALNAME:Test Event
      TIMEZONE-ID:America/Denver
      X-WR-TIMEZONE:America/Denver
      BEGIN:VEVENT
      UID:NORMALIZED
      SEQUENCE:0
      DTSTAMP:NORMALIZED
      DTSTART:20250115T110000
      DTEND:20250115T130000
      SUMMARY:Test Event
      LOCATION:https://example.com
      DESCRIPTION:Test Description
      URL;VALUE=URI:https://example.com
      END:VEVENT
      END:VCALENDAR"
    `);
  });

  it('handles event without optional fields', () => {
    const minimalEvent: DiscordEvent = {
      guildID: 'test-guild',
      name: 'Minimal Event',
      desc: undefined,
      location: undefined,
      start: new Date('2025-01-15T18:00:00Z'),
      end: undefined,
    };

    const icsString = normalizeICS(createEventICS(minimalEvent));

    expect(icsString).toMatchInlineSnapshot(`
      "BEGIN:VCALENDAR
      VERSION:2.0
      PRODID:-//sebbo.net//ical-generator//EN
      NAME:Minimal Event
      X-WR-CALNAME:Minimal Event
      TIMEZONE-ID:America/Denver
      X-WR-TIMEZONE:America/Denver
      BEGIN:VEVENT
      UID:NORMALIZED
      SEQUENCE:0
      DTSTAMP:NORMALIZED
      DTSTART:20250115T110000
      SUMMARY:Minimal Event
      END:VEVENT
      END:VCALENDAR"
    `);
  });
});
