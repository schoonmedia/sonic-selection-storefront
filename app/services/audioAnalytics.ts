import type {PlayerEvent, PlayerEventName} from '~/types/audio';

/**
 * Central place to emit player analytics events — the "Herz der Plattform"
 * data pipeline: what's being listened to, for how long, by whom. Every
 * event is timestamped, tagged with a stable anonymous session id, buffered
 * to localStorage (so a page close right after an event doesn't lose it),
 * and flushed in batches to POST /api/analytics/event (see
 * app/routes/api.analytics.event.tsx).
 *
 * That route currently just structured-logs each event — Phase 1, same
 * pattern as before. Swapping in a real analytics backend (GA4, PostHog, a
 * custom store) only touches that one route; nothing here or at any call
 * site needs to change.
 *
 * De-duplication: callers are responsible for only calling this from a
 * single source of truth per event (useAudioEngine for playback events),
 * so we don't fire duplicates from multiple components reacting to the
 * same state change.
 */

const SESSION_STORAGE_KEY = 'ss_analytics_session_id';
const QUEUE_STORAGE_KEY = 'ss_analytics_queue';
const FLUSH_INTERVAL_MS = 15_000;
const MAX_QUEUE = 500;
const MAX_BUFFER = 200;

const recentEvents: PlayerEvent[] = [];
let queue: PlayerEvent[] = loadQueue();
let sessionId: string | null = null;
let flushTimer: ReturnType<typeof setInterval> | null = null;

function getSessionId(): string {
  if (sessionId) return sessionId;
  if (typeof window === 'undefined') return 'ssr';

  try {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) {
      sessionId = existing;
      return existing;
    }
  } catch {
    // localStorage unavailable (private mode, disabled storage, ...) —
    // fall through to a session id that only lives for this page load.
  }

  const generated =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  sessionId = generated;
  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, generated);
  } catch {
    // ignore — see above
  }
  return generated;
}

function loadQueue(): PlayerEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(QUEUE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PlayerEvent[]) : [];
  } catch {
    return [];
  }
}

function persistQueue() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue.slice(-MAX_QUEUE)));
  } catch {
    // ignore — worst case we lose the durability buffer, not the events
    // already in flight for this page load.
  }
}

function ensureFlushScheduled() {
  if (typeof window === 'undefined' || flushTimer) return;
  flushTimer = setInterval(flush, FLUSH_INTERVAL_MS);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
  window.addEventListener('pagehide', () => flush());
}

/** Sends buffered events to /api/analytics/event and clears the local
 *  queue. Prefers sendBeacon (survives tab close mid-request); falls back
 *  to a keepalive fetch when unavailable. A failed fetch drops that batch
 *  rather than re-queueing, to avoid retry loops against a broken
 *  endpoint — acceptable for a Phase 1 pipeline. */
function flush() {
  if (typeof window === 'undefined' || queue.length === 0) return;
  const batch = queue;
  queue = [];
  persistQueue();

  const body = JSON.stringify({events: batch});
  const sent =
    'sendBeacon' in navigator &&
    navigator.sendBeacon('/api/analytics/event', new Blob([body], {type: 'application/json'}));

  if (!sent) {
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body,
      keepalive: true,
    }).catch(() => {
      // Lost this batch — see doc comment above.
    });
  }
}

export function emitPlayerEvent(
  input: {
    name: PlayerEventName;
    trackId?: string;
    productId?: string;
    position?: number;
    listenedMs?: number;
    percentComplete?: number;
  },
): void {
  const event: PlayerEvent = {...input, timestamp: Date.now(), sessionId: getSessionId()};

  recentEvents.push(event);
  if (recentEvents.length > MAX_BUFFER) recentEvents.shift();

  if (typeof window !== 'undefined' && import.meta.env?.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[player-event]', event.name, event);
  }

  queue.push(event);
  persistQueue();
  ensureFlushScheduled();
}

/** Exposed for debugging / future recommendation-engine consumption. */
export function getRecentPlayerEvents(): readonly PlayerEvent[] {
  return recentEvents;
}
