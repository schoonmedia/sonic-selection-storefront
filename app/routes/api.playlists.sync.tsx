import type {Route} from './+types/api.playlists.sync';
import {CUSTOMER_PLAYLISTS_QUERY} from '~/graphql/customer-account/CustomerPlaylistsQuery';
import {CUSTOMER_PLAYLISTS_MUTATION} from '~/graphql/customer-account/CustomerPlaylistsMutation';
import {CUSTOMER_ID_QUERY} from '~/graphql/customer-account/CustomerIdQuery';
import type {Playlist} from '~/types/playlist';

/**
 * Resource route (no UI). The server half of the playlists sync described
 * in docs/playlists-and-profile.md — localStorage is the always-on layer
 * (app/stores/playlistStore.ts), this route is the opt-in layer for
 * logged-in customers so playlists survive across devices.
 *
 * GET  /api/playlists/sync  → {playlists: Playlist[]} if logged in, 401 if not.
 * POST /api/playlists/sync  → body {playlists: Playlist[]}, writes to the
 *                              custom.playlists customer metafield.
 *
 * Both branches treat "not logged in" as a normal, expected outcome (not an
 * error) — usePlaylistPersistence falls back to local-only in that case.
 */
export async function loader({context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const noStore = {headers: {'Cache-Control': 'private, no-store'}} as const;

  const isLoggedIn = await customerAccount.isLoggedIn();
  if (!isLoggedIn) {
    return Response.json({loggedIn: false}, {status: 401, ...noStore});
  }

  try {
    const {data} = await customerAccount.query(CUSTOMER_PLAYLISTS_QUERY);
    const raw = data?.customer?.playlists?.value;
    const playlists: Playlist[] = raw ? safeParsePlaylists(raw) : [];
    return Response.json({loggedIn: true, playlists}, noStore);
  } catch (error) {
    console.error('[playlists-sync] loading failed', error);
    return Response.json({loggedIn: true, playlists: []}, noStore);
  }
}

export async function action({request, context}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', {status: 405});
  }

  const {customerAccount} = context;
  const isLoggedIn = await customerAccount.isLoggedIn();
  if (!isLoggedIn) {
    return Response.json({ok: false, error: 'not logged in'}, {status: 401});
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ok: false, error: 'invalid JSON'}, {status: 400});
  }

  const playlists = isPlaylistsBody(body) ? body.playlists : null;
  if (!playlists) {
    return Response.json({ok: false, error: 'missing playlists'}, {status: 400});
  }

  const {data: idData, errors: idErrors} = await customerAccount.query(CUSTOMER_ID_QUERY);
  if (idErrors?.length || !idData?.customer?.id) {
    return Response.json({ok: false, error: 'could not resolve customer id'}, {status: 400});
  }

  const {data: mutationData, errors} = await customerAccount.mutate(CUSTOMER_PLAYLISTS_MUTATION, {
    variables: {
      customerId: idData.customer.id,
      value: JSON.stringify(playlists),
      language: customerAccount.i18n.language,
    },
  });

  const userError = mutationData?.metafieldsSet?.userErrors?.[0];
  if (errors?.length || userError) {
    console.error('[playlists-sync] save failed', errors ?? userError);
    return Response.json(
      {ok: false, error: errors?.[0]?.message ?? userError?.message ?? 'save failed'},
      {status: 400},
    );
  }

  return Response.json({ok: true});
}

function safeParsePlaylists(raw: string): Playlist[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Playlist[]) : [];
  } catch {
    return [];
  }
}

function isPlaylistsBody(value: unknown): value is {playlists: Playlist[]} {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as {playlists?: unknown}).playlists)
  );
}
