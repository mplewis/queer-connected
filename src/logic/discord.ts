import dayjs from 'dayjs';
import {
  Client,
  GatewayIntentBits,
  type Guild,
  type GuildScheduledEventRecurrenceRule,
} from 'discord.js';
import pino from 'pino';
import { z } from 'zod';
import { DISCORD_BOT_TOKEN } from '../config/env';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

/** If not specified, expand each recurring event to this many occurrences in the future. */
const DEFAULT_RECURRENCE_EXPAND_COUNT = 10;

/** Cache all events, once per compilation. */
let allEvents: DiscordEvent[] | null = null;

/** A simplified representation of a Discord scheduled event. */
export type DiscordEvent = {
  guildID: string;
  name: string;
  desc: string | undefined;
  start: Date;
  end: Date | undefined;
  location: string | undefined;
  recurrenceRule?: GuildScheduledEventRecurrenceRule;
};

/** Public event type without sensitive guild information. */
export type PublicEvent = Omit<DiscordEvent, 'guildID'>;

/** Zod schema for validating Discord recurrence rule objects. */
const recurrenceRuleSchema = z.object({
  startTimestamp: z.number(),
  startAt: z.date(),
  endTimestamp: z.number().nullable(),
  endAt: z.date().nullable(),
  frequency: z.number(),
  interval: z.number(),
  byWeekday: z.array(z.number()).nullable(),
  byNWeekday: z.array(z.number()).nullable(),
  byMonth: z.array(z.number()).nullable(),
  byMonthDay: z.array(z.number()).nullable(),
  byYearDay: z.array(z.number()).nullable(),
  count: z.number().nullable(),
});

/** Zod schema for validating Discord scheduled event objects. */
const discordEventSchema = z.object({
  guild: z.object({ id: z.string() }),
  name: z.string(),
  description: z.string().optional(),
  scheduledStartAt: z.date(),
  scheduledEndAt: z.date().optional(),
  entityMetadata: z.object({ location: z.string() }).optional(),
  recurrenceRule: recurrenceRuleSchema.nullish(),
});

/**
 * Map Discord recurrence frequency codes to day.js time units.
 * See: https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-recurrence-rule-object-guild-scheduled-event-recurrence-rule-frequency
 */
const FREQUENCIES = {
  0: 'year',
  1: 'month',
  2: 'week',
  3: 'day',
} as const;

/**
 * Convert a Discord recurrence rule to a generator of future dates.
 * Simple implementation that handles interval/frequency but does not properly handle `by_weekday`, `by_n_weekday`, etc.
 * Only yield dates in the future, skipping any dates before the current time.
 */
export function* rrToDates(
  rr: Pick<GuildScheduledEventRecurrenceRule, 'startAt' | 'endAt' | 'frequency' | 'interval'>
): Generator<Date, null, void> {
  let date = dayjs(rr.startAt);
  const end = rr.endAt && dayjs(rr.endAt);
  const freq = FREQUENCIES[rr.frequency];
  while (true) {
    if (end && date.isAfter(end)) break;
    // Don't yield dates in the past
    if (date.isAfter(dayjs())) yield date.toDate();
    date = date.add(rr.interval, freq);
  }
  return null;
}

/**
 * Authenticate with Discord using the DISCORD_BOT_TOKEN environment variable.
 * Return a ready Discord client instance.
 */
async function login() {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  return new Promise<Client>((resolve, reject) => {
    try {
      client.once('ready', () => {
        logger.info({ user: client.user?.tag }, 'Logged in to Discord');
        resolve(client);
      });
      client.login(DISCORD_BOT_TOKEN);
    } catch (error) {
      reject(error as Error);
    }
  });
}

/**
 * Fetch all scheduled events from a Discord guild, expand recurring events into individual occurrences,
 * and return them as simplified DiscordEvent objects.
 */
async function getScheduledEvents(
  guild: Guild,
  recurrenceExpandCount: number
): Promise<DiscordEvent[]> {
  const events = await guild.scheduledEvents.fetch();
  logger.debug({ eventCount: events.size, guildId: guild.id }, 'Fetched scheduled events');
  const parsed = events
    .map((event) => {
      const result = discordEventSchema.safeParse(event);
      if (!result.success) {
        logger.error(
          {
            eventId: event.id,
            eventName: event.name,
            errors: result.error.issues,
          },
          'Error parsing event from Discord'
        );
        return null;
      }
      return result.data;
    })
    .filter((e) => e !== null);

  const expanded = parsed.flatMap((event) => {
    logger.debug({ event }, 'Processing event');
    if (!event.recurrenceRule) return [event];
    const rr = event.recurrenceRule;

    const duration =
      event.scheduledEndAt && dayjs(event.scheduledEndAt).diff(dayjs(event.scheduledStartAt));

    const iter = rrToDates(rr).take(recurrenceExpandCount);
    return Array.from(iter).map((start) => ({
      ...event,
      scheduledStartAt: start,
      scheduledEndAt: duration ? dayjs(start).add(duration).toDate() : undefined,
    }));
  });

  const structured = expanded.map((e) => ({
    guildID: e.guild.id,
    name: e.name,
    desc: e.description,
    start: e.scheduledStartAt,
    end: e.scheduledEndAt ?? e.scheduledStartAt,
    location: e.entityMetadata?.location,
  }));
  return structured;
}

/**
 * Fetch scheduled events from all guilds the bot has access to.
 * Results are cached after the first call.
 */
async function getScheduledEventsForAllGuilds(recurrenceExpandCount: number) {
  if (allEvents !== null) return allEvents;

  const client = await login();
  const guildObjs = await client.guilds.fetch();
  const guilds = await Promise.all(guildObjs.map(async (g) => client.guilds.fetch(g.id)));
  logger.info({ guildCount: guilds.length }, 'Found guilds');

  allEvents = (
    await Promise.all(guilds.map(async (g) => getScheduledEvents(g, recurrenceExpandCount)))
  ).flat();
  logger.info({ eventCount: allEvents.length }, 'Found events');
  allEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
  return allEvents;
}

/**
 * Fetch all scheduled events for a specific Discord guild.
 * Recurring events are expanded into individual occurrences based on recurrenceExpandCount.
 */
export async function getScheduledEventsForGuild(
  guildID: string,
  recurrenceExpandCount = DEFAULT_RECURRENCE_EXPAND_COUNT
) {
  const events = await getScheduledEventsForAllGuilds(recurrenceExpandCount);
  return events.filter((e) => e.guildID === guildID);
}
