import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import type React from 'react';
import type { DiscordEvent } from '../logic/discord';
import { currentMonthAtom, selectedDateAtom } from '../store/events';
import { Button } from './Button';
import { Stack } from './Stack';
import './EventCalendar.css';

export interface EventCalendarProps {
  events: DiscordEvent[];
}

/**
 * Monthly calendar component with day selection and event highlighting.
 * Shows a Sun-Sat layout with prev/next month navigation.
 */
export function EventCalendar({ events }: EventCalendarProps): React.JSX.Element {
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [currentMonth, setCurrentMonth] = useAtom(currentMonthAtom);

  const eventDates = new Set(events.map((event) => dayjs(event.start).format('YYYY-MM-DD')));

  const startOfMonth = dayjs(currentMonth).startOf('month');
  const endOfMonth = dayjs(currentMonth).endOf('month');
  const startOfCalendar = startOfMonth.startOf('week');
  const endOfCalendar = endOfMonth.endOf('week');

  const days: Date[] = [];
  let currentDay = startOfCalendar;
  while (currentDay.isBefore(endOfCalendar) || currentDay.isSame(endOfCalendar, 'day')) {
    days.push(currentDay.toDate());
    currentDay = currentDay.add(1, 'day');
  }

  const handlePrevMonth = () => {
    setCurrentMonth(dayjs(currentMonth).subtract(1, 'month').toDate());
  };

  const handleNextMonth = () => {
    setCurrentMonth(dayjs(currentMonth).add(1, 'month').toDate());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="event-calendar">
      <Stack gap="md">
        <div className="event-calendar__header">
          <Button variant="ghost" size="sm" onClick={handlePrevMonth}>
            ←
          </Button>
          <h2 className="event-calendar__month">{dayjs(currentMonth).format('MMMM YYYY')}</h2>
          <Button variant="ghost" size="sm" onClick={handleNextMonth}>
            →
          </Button>
        </div>

        <div className="event-calendar__weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="event-calendar__weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="event-calendar__days">
          {days.map((day) => {
            const dayKey = dayjs(day).format('YYYY-MM-DD');
            const isCurrentMonth = dayjs(day).isSame(currentMonth, 'month');
            const isSelected = dayjs(day).isSame(selectedDate, 'day');
            const isToday = dayjs(day).isSame(dayjs(), 'day');
            const hasEvents = eventDates.has(dayKey);

            return (
              <button
                type="button"
                key={dayKey}
                onClick={() => handleDateClick(day)}
                className={`event-calendar__day ${!isCurrentMonth ? 'event-calendar__day--other-month' : ''} ${isSelected ? 'event-calendar__day--selected' : ''} ${isToday ? 'event-calendar__day--today' : ''} ${hasEvents ? 'event-calendar__day--has-events' : ''}`}
              >
                {dayjs(day).format('D')}
              </button>
            );
          })}
        </div>
      </Stack>
    </div>
  );
}
