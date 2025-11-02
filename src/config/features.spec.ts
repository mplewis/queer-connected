import { beforeEach, describe, expect, it, vi } from 'vitest';
import { featureEnabled } from './features';

describe('featureEnabled', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns default value when env var is not set', () => {
    expect(featureEnabled('events')).toBe(false);
  });

  it.each([
    ['true', true],
    ['1', true],
    ['yes', true],
    ['y', true],
    ['on', true],
    ['TRUE', true],
    ['YeS', true],
    ['  true  ', true],
    ['false', false],
    ['0', false],
    ['no', false],
    ['', false],
    ['maybe', false],
  ])('returns %s for "%s"', (value, expected) => {
    vi.stubEnv('FEATURE_EVENTS', value);
    expect(featureEnabled('events')).toBe(expected);
  });
});
