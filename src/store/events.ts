import { atom } from 'jotai';
import { nowAsLocal } from '../utils/timezone';

/** Number of days before today to show events */
export const DAYS_BEFORE_TODAY = 7;

/** Number of days after today to show events */
export const DAYS_AFTER_TODAY = 90;

/** Currently selected date in the calendar */
export const selectedDateAtom = atom<Date>(nowAsLocal().toDate());

/** Current month being displayed in the calendar */
export const currentMonthAtom = atom<Date>(nowAsLocal().toDate());
