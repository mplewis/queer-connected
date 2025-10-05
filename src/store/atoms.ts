import { atomWithStorage } from 'jotai/utils';
import { z } from 'zod';

const themeSchema = z.enum(['light', 'dark', 'system']);

export type Theme = z.infer<typeof themeSchema>;

export const themeAtom = atomWithStorage<Theme>('theme', 'system', undefined, {
  getOnInit: true,
});

const userPreferencesSchema = z.object({
  notifications: z.boolean(),
  language: z.string(),
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export const userPreferencesAtom = atomWithStorage<UserPreferences>(
  'userPreferences',
  {
    notifications: true,
    language: 'en',
  },
  undefined,
  { getOnInit: true }
);

export function validateTheme(value: unknown): Theme {
  return themeSchema.parse(value);
}

export function validateUserPreferences(value: unknown): UserPreferences {
  return userPreferencesSchema.parse(value);
}
