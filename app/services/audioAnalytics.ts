import type {PlayerEvent, PlayerEventName} from '~/types/audio';

/**
 * Central place to emit player analytics events. Phase 1 just logs to the
 * console (and, in dev, keeps an in-memory buffer) so we can see the event
 * stream while building the recommendation engine later. Swap the body of
 * `emitPlayerEvent` for a real sink (Shopify Web Pixels, GA4, a custom
 * endpoint...) without touching call sites in hooks/components.
 *
 * De-duplication: callers are responsible for only calling this from a
 * single source of truth per event (useAudioEngine for playback events),
 * so we don't fire duplicates from multiple components reacting to the
 * same state change.
 */

const recentEvents: PlayerEvent[] = [];
const MAX_BUFFER = 200;

export function emitPlayerEvent(
  input: {name: PlayerEventName; trackId?: string; productId?: string; position?: number},
): void {
  const event: PlayerEvent = {...input, timestamp: Date.now()};

  recentEvents.push(event);
  if (recentEvents.length > MAX_BUFFER) recentEvents.shift();

  if (typeof window !== 'undefined' && import.meta.env?.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[player-event]', event.name, event);
  }

  // TODO Phase 1.5: forward to Shopify Customer Events / a real analytics
  // sink. Keep this function the single call site so we can add batching,
  // retries, or consent checks in one place.
}

/** Exposed for debugging / future recommendation-engine consumption. */
export function getRecentPlayerEvents(): readonly PlayerEvent[] {
  return recentEvents;
}
