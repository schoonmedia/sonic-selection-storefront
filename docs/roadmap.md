# Roadmap / Backlog

Lebendes Dokument für offene Punkte, die nicht sofort umgesetzt wurden.
Neueste Priorisierung zuerst.

## Aktuell priorisiert

### 1. Mediathek-Schnellzugriff im Header
`/library` (Mediathek) ist aktuell nur über das Account-Menü erreichbar.
Ein Icon im Header (neben dem Favoriten-Herz) würde die Auffindbarkeit
erhöhen, siehe `components/Header.tsx` → `FavoritesLink()` als Vorlage.

### 2. Playlist-Reordering
Playlists erlauben aktuell nur Hinzufügen/Entfernen von Tracks
(`stores/playlistStore.ts`), keine Neusortierung per Drag. Position wird
aktuell implizit durch Array-Reihenfolge bestimmt.

## Blockiert (warten auf externe Eingabe)

- **Podcast-Content**: Datenmodell ist vorbereitet (`PlaylistTrackRef.contentType`
  unterstützt schon `'track'` mit Blick auf ein künftiges `'episode'`), aber
  es gibt noch keine Entscheidung, woher Episoden/RSS-Feed kommen sollen.
- **Tims Sound-Pack-Sync**: `docs/sound-pack-ingestion-workflow.md` beschreibt
  den `rclone`-Workflow, wartet aber auf Tims tatsächlichen Cloud-Ordner-Link
  und Zugangsdaten, bevor er mit echten Daten operationalisiert werden kann.

## Erledigt (zur Referenz, siehe git log für Details)

- Player-Analytics-Pipeline (PostHog)
- Ableton Drag & Drop (Chrome, purchase-gated)
- Playlists (local-first + Customer-Metafield-Sync)
- Mediathek (`/library`): aggregierte Übersicht aus Playlists, Favoriten,
  Zuletzt gehört
- Fallback-Download-Button für Safari/Firefox (`DragToDaw.tsx`)
