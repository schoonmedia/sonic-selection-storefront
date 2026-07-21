export type GlobalPlayerShellProps = {
  title?: string;
  track?: string;
  coverUrl?: string;
  isPlaying?: boolean;
  currentTime?: string;
  duration?: string;
};

export function GlobalPlayerShell({
  title = 'Dark Trap Vol. 5',
  track = '808 Mob – Hard 808',
  coverUrl,
  isPlaying = false,
  currentTime = '0:26',
  duration = '1:20',
}: GlobalPlayerShellProps) {
  return (
    <aside className="ss-player" aria-label="Global audio player">
      <div className="ss-player__inner">
        <div className="ss-player__now-playing">
          {coverUrl ? <img src={coverUrl} alt="" /> : <div className="ss-player__cover" />}
          <div>
            <strong>{title}</strong>
            <span>{track}</span>
          </div>
        </div>
        <div className="ss-player__controls">
          <button aria-label="Previous track">◀</button>
          <button className="ss-player__main" aria-label={isPlaying ? 'Pause' : 'Play'}>{isPlaying ? 'Ⅱ' : '▶'}</button>
          <button aria-label="Next track">▶</button>
        </div>
        <div className="ss-player__progress">
          <span>{currentTime}</span>
          <div className="ss-player__bar"><span style={{width: '33%'}} /></div>
          <span>{duration}</span>
        </div>
      </div>
    </aside>
  );
}
