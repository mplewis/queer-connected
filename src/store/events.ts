import { atom } from 'jotai';

/** Number of days before today to show events */
export const DAYS_BEFORE_TODAY = 7;

/** Number of days after today to show events */
export const DAYS_AFTER_TODAY = 90;

/** Currently selected date in the calendar */
export const selectedDateAtom = atom<Date>(new Date());

/** Current month being displayed in the calendar */
export const currentMonthAtom = atom<Date>(new Date());
