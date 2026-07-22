import type {DragEvent} from 'react';
import {emitPlayerEvent} from '~/services/audioAnalytics';
import type {AuthorizedTrack} from '~/hooks/useDownloadAuthorization';

function IconDrag() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="3" r="1.3" />
      <circle cx="5" cy="8" r="1.3" />
      <circle cx="5" cy="13" r="1.3" />
      <circle cx="11" cy="3" r="1.3" />
      <circle cx="11" cy="8" r="1.3" />
      <circle cx="11" cy="13" r="1.3" />
    </svg>
  );
}

/**
 * Drag handle for pulling a purchased/free sample's full-quality master
 * straight into a DAW like Ableton. Only ever rendered for tracks
 * `useDownloadAuthorization` has confirmed the visitor may download — see
 * docs/ableton-drag-and-drop.md for the full design.
 *
 * Uses Chrome/Chromium's `DownloadURL` drag-and-drop convention: setting
 * `MIME:filename:url` on dragstart makes the browser fetch the file in the
 * background and hand it to the OS drop target as a real file drag, so
 * Ableton (or Finder/Explorer) sees an ordinary file drop. Safari/Firefox
 * don't support this data type and silently ignore it — this handle is a
 * progressive enhancement, not the only way to get the file.
 */
export function DragToDaw({track, productId}: {track: AuthorizedTrack; productId: string}) {
  const filename = buildFilename(track.title, track.downloadUrl);
  const mimeType = guessMimeType(track.downloadUrl);

  const handleDragStart = (event: DragEvent<HTMLSpanElement>) => {
    event.dataTransfer.setData('DownloadURL', `${mimeType}:${filename}:${track.downloadUrl}`);
    event.dataTransfer.effectAllowed = 'copy';
    emitPlayerEvent({name: 'track_dragged_to_daw', trackId: track.trackId, productId});
  };

  return (
    <span
      className="drag-to-daw-handle"
      draggable
      onDragStart={handleDragStart}
      title="In Ableton/DAW ziehen"
      role="img"
      aria-label={`${track.title} in DAW ziehen`}
    >
      <IconDrag />
    </span>
  );
}

function buildFilename(title: string, downloadUrl: string): string {
  const safeTitle = title.trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') || 'sample';
  const extension = extensionFromUrl(downloadUrl);
  return `${safeTitle}${extension}`;
}

function extensionFromUrl(downloadUrl: string): string {
  try {
    const pathname = new URL(downloadUrl).pathname;
    const match = /\.[a-zA-Z0-9]+$/.exec(pathname);
    return match ? match[0] : '.wav';
  } catch {
    return '.wav';
  }
}

function guessMimeType(downloadUrl: string): string {
  const extension = extensionFromUrl(downloadUrl).toLowerCase();
  switch (extension) {
    case '.mp3':
      return 'audio/mpeg';
    case '.aiff':
    case '.aif':
      return 'audio/aiff';
    case '.wav':
    default:
      return 'audio/wav';
  }
}
