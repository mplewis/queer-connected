import dayjs from 'dayjs';
import { useAtom, useSetAtom } from 'jotai';
import type React from 'react';
import type { DiscordEvent } from '../logic/discord';
import { currentMonthAtom, selectedDateAtom } from '../store/events';
import { Button } from './Button';
import './MonthPicker.css';

export interface MonthPickerProps {
  events: DiscordEvent[];
}

/**
 * Mobile-friendly month selector with prev/next navigation.
 * Displays in "<< September 2025 >>" format.
 * Clicking month name jumps to today. Changing month scrolls to first event in that month.
 */
export function MonthPicker({ events }: MonthPickerProps): React.JSX.Element {
  const [currentMonth, setCurrentMonth] = useAtom(currentMonthAtom);
  const setSelectedDate = useSetAtom(selectedDateAtom);

  const findFirstEventInMonth = (month: Date): Date | null => {
    const monthStart = dayjs(month).startOf('month');
    const monthEnd = dayjs(month).endOf('month');

    const eventInMonth = events.find((event) => {
      const eventDate = dayjs(event.start);
      return eventDate.isAfter(monthStart) && eventDate.isBefore(monthEnd);
    });

    return eventInMonth?.start || null;
  };

  const handlePrevMonth = () => {
    const newMonth = dayjs(currentMonth).subtract(1, 'month').toDate();
    setCurrentMonth(newMonth);
    const firstEvent = findFirstEventInMonth(newMonth);
    if (firstEvent) {
      setSelectedDate(firstEvent);
    }
  };

  const handleNextMonth = () => {
    const newMonth = dayjs(currentMonth).add(1, 'month').toDate();
    setCurrentMonth(newMonth);
    const firstEvent = findFirstEventInMonth(newMonth);
    if (firstEvent) {
      setSelectedDate(firstEvent);
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  return (
    <div className="month-picker">
      <Button variant="ghost" size="sm" onClick={handlePrevMonth}>
        &#x3c;&#x3c;
      </Button>
      <button type="button" className="month-picker__label" onClick={handleTodayClick}>
        {dayjs(currentMonth).format('MMMM YYYY')}
      </button>
      <Button variant="ghost" size="sm" onClick={handleNextMonth}>
        &#x3e;&#x3e;
      </Button>
    </div>
  );
}
