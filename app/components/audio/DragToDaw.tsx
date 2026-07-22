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

function IconDownload() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 2v7.5M8 9.5 5 6.5M8 9.5l3-3M3 12.5h10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Drag handle + fallback download link for pulling a purchased/free
 * sample's full-quality master out of the browser. Only ever rendered for
 * tracks `useDownloadAuthorization` has confirmed the visitor may download
 * — see docs/ableton-drag-and-drop.md for the full design.
 *
 * The drag handle uses Chrome/Chromium's `DownloadURL` drag-and-drop
 * convention: setting `MIME:filename:url` on dragstart makes the browser
 * fetch the file in the background and hand it to the OS drop target as a
 * real file drag, so Ableton (or Finder/Explorer) sees an ordinary file
 * drop. Safari/Firefox don't support this data type and silently ignore
 * it — for those browsers (and anyone who'd rather click than drag) the
 * plain download link next to it is the actual way to get the file. Both
 * point at the same authorized `downloadUrl`, so this doesn't widen the
 * purchase-gate at all — see docs/roadmap.md item 1 for why this exists.
 */
export function DragToDaw({track, productId}: {track: AuthorizedTrack; productId: string}) {
  const filename = buildFilename(track.title, track.downloadUrl);
  const mimeType = guessMimeType(track.downloadUrl);

  const handleDragStart = (event: DragEvent<HTMLSpanElement>) => {
    event.dataTransfer.setData('DownloadURL', `${mimeType}:${filename}:${track.downloadUrl}`);
    event.dataTransfer.effectAllowed = 'copy';
    emitPlayerEvent({name: 'track_dragged_to_daw', trackId: track.trackId, productId});
  };

  const handleDownloadClick = () => {
    emitPlayerEvent({name: 'track_downloaded', trackId: track.trackId, productId});
  };

  return (
    <span className="drag-to-daw-group">
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
      <a
        className="download-fallback-button"
        href={track.downloadUrl}
        download={filename}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleDownloadClick}
        title="Herunterladen"
        aria-label={`${track.title} herunterladen`}
      >
        <IconDownload />
      </a>
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
