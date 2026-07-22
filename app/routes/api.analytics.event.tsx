import type {Route} from './+types/api.analytics.event';

/**
 * Resource route (no UI). POST /api/analytics/event
 *
 * Receives batched player-listen events from services/audioAnalytics.ts
 * (sent via sendBeacon or a keepalive fetch — see that file for the client
 * side: session id, localStorage durability queue, periodic flush).
 *
 * Phase 1: validate the batch shape and structured-log each event so the
 * pipeline is provably live end-to-end (visible in `npm run dev` / Oxygen
 * request logs) without committing to a specific analytics backend yet.
 *
 * TODO Phase 1.5: forward `events` to a real sink once one is chosen (GA4
 * Measurement Protocol, PostHog capture API, or a custom store). This is
 * the only place that needs to change — client-side batching/session
 * logic and every call site stay the same regardless of backend.
 */
export async function action({request}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', {status: 405});
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ok: false, error: 'invalid JSON'}, {status: 400});
  }

  const events = isEventBatch(payload) ? payload.events : null;
  if (!events || events.length === 0) {
    return Response.json({ok: false, error: 'no events'}, {status: 400});
  }

  // Structured log line per event — cheap, greppable, enough to verify the
  // pipeline while a real sink is chosen. Capped defensively; a well-formed
  // client never sends more than a few dozen events per flush.
  for (const event of events.slice(0, 500)) {
    // eslint-disable-next-line no-console
    console.log('[analytics-event]', JSON.stringify(event));
  }

  return Response.json({ok: true, received: events.length});
}

interface AnalyticsEventBatch {
  events: Array<Record<string, unknown>>;
}

function isEventBatch(value: unknown): value is AnalyticsEventBatch {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as {events?: unknown}).events)
  );
}
