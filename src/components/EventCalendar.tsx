import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import type React from 'react';
import type { PublicEvent } from '../logic/discord';
import {
  currentMonthAtom,
  DAYS_AFTER_TODAY,
  DAYS_BEFORE_TODAY,
  selectedDateAtom,
} from '../store/events';
import { Button } from './Button';
import { Stack } from './Stack';
import './EventCalendar.css';

export interface EventCalendarProps {
  events: PublicEvent[];
}

/**
 * Monthly calendar component with day selection and event highlighting.
 * Shows a Sun-Sat layout with prev/next month navigation.
 * Click month/year header to jump to today.
 */
export function EventCalendar({ events }: EventCalendarProps): React.JSX.Element {
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [currentMonth, setCurrentMonth] = useAtom(currentMonthAtom);

  const minDate = dayjs().subtract(DAYS_BEFORE_TODAY, 'day').startOf('day');
  const maxDate = dayjs().add(DAYS_AFTER_TODAY, 'day').endOf('day');

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
    const newMonth = dayjs(currentMonth).subtract(1, 'month');
    if (newMonth.endOf('month').isBefore(minDate)) return;
    setCurrentMonth(newMonth.toDate());
  };

  const handleNextMonth = () => {
    const newMonth = dayjs(currentMonth).add(1, 'month');
    if (newMonth.startOf('month').isAfter(maxDate)) return;
    setCurrentMonth(newMonth.toDate());
  };

  const handleDateClick = (date: Date) => {
    const dateDay = dayjs(date);
    if (dateDay.isBefore(minDate) || dateDay.isAfter(maxDate)) return;
    setSelectedDate(date);
  };

  const canGoPrev = dayjs(currentMonth).subtract(1, 'month').endOf('month').isAfter(minDate);
  const canGoNext = dayjs(currentMonth).add(1, 'month').startOf('month').isBefore(maxDate);

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  return (
    <div className="event-calendar">
      <Stack gap="md">
        <div className="event-calendar__header">
          <Button variant="ghost" size="sm" onClick={handlePrevMonth} disabled={!canGoPrev}>
            ←
          </Button>
          <button type="button" className="event-calendar__month" onClick={handleTodayClick}>
            {dayjs(currentMonth).format('MMMM YYYY')}
          </button>
          <Button variant="ghost" size="sm" onClick={handleNextMonth} disabled={!canGoNext}>
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
            const dayObj = dayjs(day);
            const isCurrentMonth = dayObj.isSame(currentMonth, 'month');
            const isSelected = dayObj.isSame(selectedDate, 'day');
            const isToday = dayObj.isSame(dayjs(), 'day');
            const hasEvents = eventDates.has(dayKey);
            const isOutOfRange = dayObj.isBefore(minDate) || dayObj.isAfter(maxDate);

            return (
              <button
                type="button"
                key={dayKey}
                onClick={() => handleDateClick(day)}
                disabled={isOutOfRange}
                className={`event-calendar__day ${!isCurrentMonth ? 'event-calendar__day--other-month' : ''} ${isSelected ? 'event-calendar__day--selected' : ''} ${isToday ? 'event-calendar__day--today' : ''} ${hasEvents ? 'event-calendar__day--has-events' : ''}`}
              >
                {dayObj.format('D')}
              </button>
            );
          })}
        </div>
      </Stack>
    </div>
  );
}
