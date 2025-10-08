import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import type { DiscordEvent } from '../logic/discord';
import { EventCard } from './EventCard';

const mockEvent: DiscordEvent = {
  guildID: 'test-guild',
  name: 'Test Event',
  desc: 'This is a test event description',
  start: new Date('2025-01-15T18:00:00Z'),
  end: new Date('2025-01-15T20:00:00Z'),
  location: 'Test Location',
};

it('renders event name', () => {
  render(<EventCard event={mockEvent} />);
  expect(screen.getByText('Test Event')).toBeInTheDocument();
});

it('renders event description', () => {
  render(<EventCard event={mockEvent} />);
  expect(screen.getByText('This is a test event description')).toBeInTheDocument();
});

it('renders event location with emoji', () => {
  render(<EventCard event={mockEvent} />);
  expect(screen.getByText(/📍 Test Location/)).toBeInTheDocument();
});

it('renders time range when end time is provided', () => {
  render(<EventCard event={mockEvent} />);
  expect(screen.getByText(/AM - \d+:\d+ [AP]M/)).toBeInTheDocument();
});

it('renders only start time when end time is missing', () => {
  const eventWithoutEnd = { ...mockEvent, end: undefined };
  render(<EventCard event={eventWithoutEnd} />);
  const timeElement = screen.getByText(/\d+:\d+ [AP]M/);
  expect(timeElement).toBeInTheDocument();
  expect(timeElement.textContent).not.toContain(' - ');
});

it('does not render location when missing', () => {
  const eventWithoutLocation = { ...mockEvent, location: undefined };
  render(<EventCard event={eventWithoutLocation} />);
  expect(screen.queryByText(/📍/)).not.toBeInTheDocument();
});

it('does not render description when missing', () => {
  const eventWithoutDesc = { ...mockEvent, desc: undefined };
  render(<EventCard event={eventWithoutDesc} />);
  expect(screen.queryByText('This is a test event description')).not.toBeInTheDocument();
});
