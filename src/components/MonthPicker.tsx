import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import type React from 'react';
import { currentMonthAtom } from '../store/events';
import { Button } from './Button';
import './MonthPicker.css';

/**
 * Mobile-friendly month selector with prev/next navigation.
 * Displays in "<< September 2025 >>" format.
 */
export function MonthPicker(): React.JSX.Element {
  const [currentMonth, setCurrentMonth] = useAtom(currentMonthAtom);

  const handlePrevMonth = () => {
    setCurrentMonth(dayjs(currentMonth).subtract(1, 'month').toDate());
  };

  const handleNextMonth = () => {
    setCurrentMonth(dayjs(currentMonth).add(1, 'month').toDate());
  };

  return (
    <div className="month-picker">
      <Button variant="ghost" size="sm" onClick={handlePrevMonth}>
        &#x3c;&#x3c;
      </Button>
      <h2 className="month-picker__label">{dayjs(currentMonth).format('MMMM YYYY')}</h2>
      <Button variant="ghost" size="sm" onClick={handleNextMonth}>
        &#x3e;&#x3e;
      </Button>
    </div>
  );
}
