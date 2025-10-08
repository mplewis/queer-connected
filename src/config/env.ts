/**
 * Get a required environment variable or throw an error if it's not set.
 */
function mustEnv(key: string): string {
  const value = import.meta.env?.[key] || process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

/** Discord bot token for authentication */
export const DISCORD_BOT_TOKEN = mustEnv('DISCORD_BOT_TOKEN');

/** Discord guild ID to fetch events from */
export const DISCORD_GUILD_ID = mustEnv('DISCORD_GUILD_ID');
