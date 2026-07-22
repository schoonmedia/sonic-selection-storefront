# Playlists + Kundenprofil

Umsetzung der Vision "Player als zentrales Element — User hat Playlists,
merkt sich Dinge (Herz), verschiedene Inhalte im Profil gespeichert, über
Sounds und perspektivisch Podcasts hinweg."

## Architekturentscheidung: lokal-first + Server-Sync für eingeloggte Kunden

Favoriten und "Zuletzt gehört" laufen bisher rein über localStorage — schnell,
kein Login nötig, aber **geräte-gebunden** (ein neues Gerät/Browser sieht sie
nicht). Für Playlists ist das nicht ausreichend, weil der User explizit
"Playlists ... im Profil gespeichert" wünscht — das impliziert Account-weite
Persistenz.

Lösung: zwei Schichten, dieselbe wie bei Favoriten als Fundament plus eine
neue Sync-Schicht obendrauf.

1. **Lokal (immer aktiv):** `playlistStore.ts` (Zustand) +
   `playlistStorage.ts` (localStorage), 1:1 nach dem Muster von
   `favoritesStore.ts`/`favoritesStorage.ts`. Funktioniert sofort, auch ohne
   Login — kein Grund, nicht-eingeloggte Besucher auszuschließen.
2. **Server-Sync (nur eingeloggt):** `custom.playlists`-Kunden-Metafield
   (JSON), analog zu `custom.music_preferences`. `usePlaylistPersistence`
   prüft beim Laden über `/api/playlists/sync` (GET), ob ein eingeloggter
   Kunde vorliegt (401 sonst) und lädt ggf. den Server-Stand. Änderungen
   werden danach debounced per POST zurückgeschrieben.

### Merge-Strategie (Phase 1, bewusst einfach)

Wenn sowohl lokal als auch Server Playlists haben (z. B. Login auf einem
neuen Gerät, das schon lokal Playlists hatte): Merge per Playlist-`id`,
bei Konflikt gewinnt die Version mit dem neueren `updatedAt`. Das ist kein
echtes Realtime-Sync/CRDT — bei gleichzeitigem Bearbeiten auf zwei Geräten
kann die ältere Version verlieren. Für Phase 1 akzeptabel; bei Bedarf später
durch feingranulareres Merging (pro Track statt pro Playlist) ersetzbar.

### Warum kein neues Backend

Ein eigenes Backend (z. B. Postgres + API) wäre die "richtige" Lösung für
komplexe Playlist-Operationen (Sharing, Kollaboration, große Playlists),
ist aber für den aktuellen Umfang Overkill und bricht mit dem Muster, das
dieses Projekt bisher konsequent verfolgt (Shopify als einzige
Backend-Quelle: Storefront API für Produkte, Customer Account API für
Kundendaten, Metaobjects für Plattform-Content). Ein JSON-Metafield trägt
für realistische Playlist-Größen (Dutzende Playlists, je Dutzende Tracks)
locker — Shopify-Metafields erlauben bis 64 KB pro Wert.

## Content-Modell (schon jetzt Podcast-kompatibel)

```ts
interface PlaylistTrackRef {
  contentType: 'track'; // 'episode' folgt, siehe unten
  trackId: string;
  productId: string;
  addedAt: number;
}

interface Playlist {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  tracks: PlaylistTrackRef[];
}
```

Das `contentType`-Feld ist bewusst schon jetzt da, obwohl aktuell nur
`'track'` vorkommt — wenn Podcast-Episoden später als eigener Inhaltstyp
dazukommen, muss das Playlist-Datenmodell nicht brechen, nur `'episode'`
als zweiter Wert ergänzt werden plus ein Episode-Renderer in der
Playlist-Ansicht.

## Bewusst NICHT Teil dieser Ausbaustufe

- **Podcast-Inhalte selbst.** Es gibt aktuell keine Podcast-Episoden, keine
  RSS-Anbindung, kein Content-Modell dafür — nur die Vorbereitung im
  Playlist-Datenmodell (`contentType`). Sound Packs sind das Kerngeschäft;
  Podcasts sind eine spätere, eigenständige Ausbaustufe mit eigenen
  Fragen (Hosting der Audiodateien, Episoden-Metadaten, RSS-Import vs.
  manuelle Pflege).
- **Playlist-Sharing / Kollaboration.** Nur der eigene Account sieht/bearbeitet
  eine Playlist.
- **Drag-Reorder innerhalb einer Playlist.** Tracks werden in Hinzufüge-
  Reihenfolge gespeichert; Neuordnen ist ein UI-Task für später.

## Beteiligte Dateien

- `app/types/playlist.ts` — Datenmodell.
- `app/services/playlistStorage.ts`, `app/stores/playlistStore.ts` —
  lokale Schicht.
- `app/graphql/customer-account/CustomerPlaylistsQuery.ts`,
  `CustomerPlaylistsMutation.ts`, `app/routes/api.playlists.sync.tsx` —
  Server-Sync-Schicht.
- `app/hooks/usePlaylistPersistence.ts` — verbindet beide Schichten,
  gemountet in `GlobalPlayer.tsx` (läuft immer, wie
  `useFavoritesPersistence`/`useHistoryPersistence`).
- `app/components/audio/AddToPlaylistButton.tsx`,
  `app/routes/playlists._index.tsx`, `app/routes/playlists.$id.tsx`.
