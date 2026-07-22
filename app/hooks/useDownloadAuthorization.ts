import {useEffect, useState} from 'react';

export interface AuthorizedTrack {
  trackId: string;
  title: string;
  downloadUrl: string;
}

interface AuthorizeResponse {
  authorized: boolean;
  tracks?: AuthorizedTrack[];
}

/**
 * Fetches which of a product's tracks the current visitor may drag the
 * full-quality master file for (see app/routes/api.downloads.authorize.tsx
 * and docs/ableton-drag-and-drop.md). Returns a lookup by trackId so
 * callers can conditionally render a <DragHandle> per tracklist row.
 *
 * Starts empty and never throws — a 401 or network failure just means no
 * drag handles render, exactly like a logged-out visitor on a paid pack.
 */
export function useDownloadAuthorization(productId: string): Record<string, AuthorizedTrack> {
  const [tracks, setTracks] = useState<Record<string, AuthorizedTrack>>({});

  useEffect(() => {
    let cancelled = false;
    setTracks({});

    fetch(`/api/downloads/authorize?productId=${encodeURIComponent(productId)}`)
      .then((res) => (res.ok ? (res.json() as Promise<AuthorizeResponse>) : null))
      .then((data) => {
        if (cancelled || !data?.authorized || !data.tracks) return;
        setTracks(Object.fromEntries(data.tracks.map((track) => [track.trackId, track])));
      })
      .catch(() => {
        // Not entitled (or offline) — same as no tracks authorized.
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  return tracks;
}
