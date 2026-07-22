import {useEffect, useState} from 'react';
import {usePlayerStore} from '~/stores/playerStore';
import {useAudioEngine} from '~/hooks/useAudioEngine';
import {usePlayerPersistence} from '~/hooks/usePlayerPersistence';
import {useFavoritesPersistence} from '~/hooks/useFavoritesPersistence';
import {useHistoryPersistence} from '~/hooks/useHistoryPersistence';
import {usePlaylistPersistence} from '~/hooks/usePlaylistPersistence';
import {useMediaSession} from '~/hooks/useMediaSession';
import {MiniPlayer} from '~/components/audio/MiniPlayer';
import {MobilePlayer} from '~/components/audio/MobilePlayer';
import {ExpandedPlayer} from '~/components/audio/ExpandedPlayer';
import {QueueDrawer} from '~/components/audio/QueueDrawer';

/**
 * Single mount point for the whole player feature. Render this exactly
 * once, in app/root.tsx, as a sibling of <Outlet /> (outside any route
 * subtree) so it survives client-side navigation.
 *
 * Composition:
 * - useAudioEngine  -> owns the one <audio> element + its event listeners
 * - usePlayerPersistence -> localStorage read/write
 * - usePlaylistPersistence -> localStorage + customer-metafield sync (see
 *   docs/playlists-and-profile.md)
 * - useMediaSession -> lock-screen / hardware media keys
 * - MiniPlayer / MobilePlayer -> bottom bar, breakpoint-switched
 * - ExpandedPlayer  -> full-screen now-playing, toggled locally
 * - QueueDrawer     -> floats above the bar when the queue is non-empty
 */
export function GlobalPlayer() {
  const activeTrack = usePlayerStore((s) => s.activeTrack);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {seek} = useAudioEngine();
  usePlayerPersistence();
  useFavoritesPersistence();
  useHistoryPersistence();
  usePlaylistPersistence();
  useMediaSession(seek);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  if (!activeTrack) return null;

  return (
    <div className="ss-global-player">
      {isExpanded && <ExpandedPlayer seek={seek} onClose={() => setIsExpanded(false)} />}
      <div style={{position: 'relative'}}>
        <div style={{position: 'absolute', top: -40, right: 16}}>
          <QueueDrawer />
        </div>
        {isMobile ? (
          <MobilePlayer onExpand={() => setIsExpanded(true)} />
        ) : (
          <MiniPlayer seek={seek} />
        )}
      </div>
    </div>
  );
}
