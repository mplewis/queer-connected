import { atom } from 'jotai';

/** Currently selected date in the calendar */
export const selectedDateAtom = atom<Date>(new Date());

/** Current month being displayed in the calendar */
export const currentMonthAtom = atom<Date>(new Date());
