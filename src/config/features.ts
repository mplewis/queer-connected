const FEATURES = {
  events: { default: false },
} as const;

const TRUTHY_ENV_VALUES = ['true', '1', 'yes', 'y', 'on'];

type FeatureKey = keyof typeof FEATURES;

/**
 * Checks if a feature is enabled.
 * Reads from FEATURE_<NAME> environment variable (e.g., FEATURE_EVENTS).
 * Falls back to the default value defined in FEATURES.
 */
export function featureEnabled(key: FeatureKey): boolean {
  const envKey = `FEATURE_${key.toUpperCase()}`;
  const envValue = import.meta.env?.[envKey] ?? process.env[envKey];

  if (envValue !== undefined) {
    const normalized = String(envValue).toLowerCase().trim();
    return TRUTHY_ENV_VALUES.includes(normalized);
  }

  return FEATURES[key].default;
}
