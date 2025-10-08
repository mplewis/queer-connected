import { useAtom } from 'jotai';
import type React from 'react';
import type { PublicEvent } from '../logic/discord';
import {
  currentMonthAtom,
  DAYS_AFTER_TODAY,
  DAYS_BEFORE_TODAY,
  selectedDateAtom,
} from '../store/events';
import { getCalendarGridForMonth } from '../utils/calendar';
import { dateAsLocal, nowAsLocal } from '../utils/timezone';
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

  const minDate = nowAsLocal().subtract(DAYS_BEFORE_TODAY, 'day').startOf('day');
  const maxDate = nowAsLocal().add(DAYS_AFTER_TODAY, 'day').endOf('day');

  const eventDates = new Set(events.map((event) => dateAsLocal(event.start).format('YYYY-MM-DD')));

  const currentMonthDate = dateAsLocal(currentMonth);
  const year = currentMonthDate.year();
  const month = currentMonthDate.month() + 1;

  const calendarDays = getCalendarGridForMonth(year, month);

  const handlePrevMonth = () => {
    const newMonth = dateAsLocal(currentMonth).subtract(1, 'month');
    if (newMonth.endOf('month').isBefore(minDate)) return;
    setCurrentMonth(newMonth.toDate());
  };

  const handleNextMonth = () => {
    const newMonth = dateAsLocal(currentMonth).add(1, 'month');
    if (newMonth.startOf('month').isAfter(maxDate)) return;
    setCurrentMonth(newMonth.toDate());
  };

  const handleDateClick = (date: Date) => {
    const dateDay = dateAsLocal(date);
    if (dateDay.isBefore(minDate) || dateDay.isAfter(maxDate)) return;

    if (!dateDay.isSame(currentMonth, 'month')) {
      setCurrentMonth(date);
    }
    setSelectedDate(date);
  };

  const canGoPrev = dateAsLocal(currentMonth).subtract(1, 'month').endOf('month').isAfter(minDate);
  const canGoNext = dateAsLocal(currentMonth).add(1, 'month').startOf('month').isBefore(maxDate);

  const handleTodayClick = () => {
    const today = nowAsLocal().toDate();
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
            {dateAsLocal(currentMonth).format('MMMM YYYY')}
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
          {calendarDays.map((calDay, index) => {
            const date = new Date(calDay.year, calDay.month - 1, calDay.day);
            const dayKey = `${index}-${calDay.year}-${calDay.month}-${calDay.day}`;
            const dayObj = dateAsLocal(date);
            const dayDateKey = dayObj.format('YYYY-MM-DD');
            const isCurrentMonth = calDay.inMonth;
            const isSelected = dayObj.isSame(selectedDate, 'day');
            const isToday = dayObj.isSame(nowAsLocal(), 'day');
            const isOutOfRange = dayObj.isBefore(minDate) || dayObj.isAfter(maxDate);
            const hasEvents = eventDates.has(dayDateKey) && isCurrentMonth && !isOutOfRange;

            return (
              <button
                type="button"
                key={dayKey}
                onClick={() => handleDateClick(date)}
                disabled={isOutOfRange}
                className={`event-calendar__day ${!isCurrentMonth ? 'event-calendar__day--other-month' : ''} ${isSelected ? 'event-calendar__day--selected' : ''} ${isToday ? 'event-calendar__day--today' : ''} ${hasEvents ? 'event-calendar__day--has-events' : ''}`}
              >
                {calDay.day}
              </button>
            );
          })}
        </div>
      </Stack>
    </div>
  );
}
