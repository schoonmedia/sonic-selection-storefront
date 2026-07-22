import type {Route} from './+types/api.analytics.event';

/**
 * Resource route (no UI). POST /api/analytics/event
 *
 * Receives batched player-listen events from services/audioAnalytics.ts
 * (sent via sendBeacon or a keepalive fetch — see that file for the client
 * side: session id, localStorage durability queue, periodic flush).
 *
 * Sink: PostHog (chosen for this project — purpose-built product-analytics
 * dashboards/insights per track & session, closer to "wie eine Shopify
 * Statistik" than a raw GA4 event explorer, generous free tier). Forwards
 * each batch via PostHog's HTTP batch-capture endpoint.
 *
 * Requires POSTHOG_API_KEY (Project API Key, safe to be server-side-only —
 * we never expose it to the client, all capture happens here) set as an
 * environment variable, both locally (.env, gitignored) and in the Shopify
 * Hydrogen storefront's environment settings for production. Optional
 * POSTHOG_HOST overrides the default EU data-residency endpoint.
 *
 * Until POSTHOG_API_KEY is set, this falls back to structured-logging each
 * event (same as before) — the pipeline stays provably live in the
 * meantime, and nothing breaks pre-signup.
 */
export async function action({request, context}: Route.ActionArgs) {
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

  // Capped defensively; a well-formed client never sends more than a few
  // dozen events per flush.
  const batch = events.slice(0, 500);
  const posthogKey = context.env.POSTHOG_API_KEY;

  if (posthogKey) {
    const host = context.env.POSTHOG_HOST ?? 'https://eu.i.posthog.com';
    try {
      await fetch(`${host}/batch/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          api_key: posthogKey,
          historical_migration: false,
          batch: batch.map(toPostHogEvent),
        }),
      });
    } catch (error) {
      // Don't fail the client's flush over a downstream PostHog outage —
      // the events already left the browser; losing one batch beats the
      // client retrying forever against a dead endpoint.
      console.error('[analytics-event] PostHog forward failed', error);
    }
  } else {
    // No key configured yet — structured-log so the pipeline is provably
    // live while POSTHOG_API_KEY is being set up.
    for (const event of batch) {
      // eslint-disable-next-line no-console
      console.log('[analytics-event]', JSON.stringify(event));
    }
  }

  return Response.json({ok: true, received: batch.length});
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

/** Maps our PlayerEvent shape onto a PostHog batch-capture item. PostHog
 *  treats `event` as the event-type name (so "track_started",
 *  "track_paused" etc. each become their own browsable event type in the
 *  PostHog UI) and `distinct_id` as the actor to group events by — we use
 *  our anonymous sessionId since there's no logged-in customer id wired in
 *  yet (a natural Phase 2 upgrade: pass the customer GID when available so
 *  listening history survives across devices/sessions). */
function toPostHogEvent(event: Record<string, unknown>) {
  const {name, sessionId, timestamp, ...properties} = event;
  return {
    event: typeof name === 'string' ? name : 'player_event',
    distinct_id: typeof sessionId === 'string' ? sessionId : 'anonymous',
    properties,
    timestamp: typeof timestamp === 'number' ? new Date(timestamp).toISOString() : undefined,
  };
}
