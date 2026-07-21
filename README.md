# Sonic Selection — Hydrogen Storefront (Phase 3 abgeschlossen)

Headless Shopify-Storefront auf Basis von [Hydrogen](https://hydrogen.shopify.dev)
(React Router 7 + Vite) mit einer eigenen Sonic-Selection-Designsprache und
einem selbst gebauten globalen Audio-Player. Kein gekauftes Theme.

## Was schon da ist

- **Hydrogen-Skeleton** (offizieller Starter, `npm create @shopify/hydrogen`):
  Produktliste, PDP, Warenkorb, Checkout-Link, Account, Suche — alles aus
  dem Standard-Starter, noch ungestyled.
- **Globaler Audio-Player** (`app/components/audio/`, `app/stores/playerStore.ts`,
  `app/hooks/`, `app/services/`, `app/types/audio.ts`): Play/Pause, Prev/Next,
  Fortschritt, Lautstärke, Queue, Mini-/Mobile-/Expanded-Ansicht,
  Media-Session-Integration (Lockscreen-Controls), localStorage-Persistenz,
  Analytics-Event-Stream (`track_started`, `track_completed`, ...).
  Eine einzige globale `<audio>`-Instanz, SSR-sicher, in `app/root.tsx`
  gemountet — bleibt bei Navigation erhalten.
- **Design-Tokens** (`app/styles/audio-player.css`): Farben/Radien aus dem
  Mock-up (Jet Black, Graphite, Electric Lime, Gold).
- **Metaobject-Spec** (`docs/shopify-audio-track-metaobject.md`): Felder für
  das "Audio Track"-Metaobjekt, in Shopify Admin angelegt und mit einem
  Test-Track befüllt.
- **Echte Shopify-Audiodaten verdrahtet**: `custom.audio_tracks`-Metafield
  läuft über alle Produkt-Queries (Startseite, Collections, PDP), Produktkarten
  zeigen einen Play-Button, die Produktdetailseite eine volle Tracklist.
- **Persistenz mit voller Rehydration**: nach einem Reload werden nicht nur
  Lautstärke/Position wiederhergestellt, sondern auch aktiver Track,
  Playlist und Queue — über `/api/audio-products` (Server-Route, holt die
  echten Shopify-Daten neu anhand der persistierten IDs).
- **Favoriten**: Herz-Button auf Produktkarten und PDP, eigene `/favorites`-
  Seite mit Live-Zähler im Header. Kein Kundenkonto nötig — läuft über
  localStorage, genau wie der Player selbst.
- **Zuletzt gehört**: Startseiten-Sektion mit den letzten Produkten/Tracks,
  die der Besucher abgespielt hat, inkl. direktem Play-Button.
- **Empfehlungs-Engine (regelbasiert)**: "Das könnte dir auch gefallen" auf
  der Produktseite — `/api/recommendations` scort andere Produkte nach
  gleichem Genre + ähnlichem BPM (bester Track-Match zählt) und zeigt die
  Top-Treffer. Zeigt aktuell nichts an, weil nur ein Testprodukt existiert —
  erledigt sich von selbst, sobald mehr Sound Packs mit Genre/BPM-Angaben
  drin sind.
- **Kundenkonto mit Onboarding-Quiz**: Login läuft über Shopifys eigenes
  Customer-Account-System (sicher, wir fassen nie Passwörter an). Nach dem
  ersten Login landet man auf `/account/preferences` — Genres per
  Chip-Auswahl, Lieblingskünstler als Freitext, oder überspringen. Antworten
  landen in einem Customer-Metafield (`custom.music_preferences`, JSON) und
  speisen eine "Für dich empfohlen"-Sektion auf der Startseite (gleiche
  Scoring-Logik wie die Produkt-Empfehlungen, nur nach Genre statt nach
  einem einzelnen Produkt gesucht).
- **CI/CD** (`.github/workflows/ci.yml`): Lint + Typecheck + Build auf jedem
  PR, Preview-Deploy auf Oxygen für PRs, Production-Deploy auf Oxygen bei
  Push auf `main`. Läuft grün, verbunden mit dem echten Store.

Typecheck, Lint und Build wurden vor jeder Übergabe verifiziert (0 Errors).

- **Design-Feinschliff (Header + Navigation):** Header läuft jetzt auf dem
  Sonic-Selection-Farbschema (Jet Black, Slate-Trennlinie, Lime als aktive/
  Hover-Farbe) statt weißem Skeleton-Standard — Logo, Menü, Account-Link,
  Favoriten-Herz, Suche und Warenkorb-Badge sind umgestellt. Cart-/Search-
  Aside (das ausklappende weiße Seitenpanel) ist bewusst noch unangetastet,
  folgt im nächsten Design-Schritt.

## Was fehlt (bewusst, laut Bauplan)

- Produktkarten/Collections/Startseite/Account-Seiten sind noch Skeleton-
  Standard, nicht das volle Sonic-Selection-Design aus dem Mock-up (Header
  ist bereits umgestellt, siehe oben).
- Echte Waveform-Peak-Daten (`Waveform.tsx` zeigt aktuell Platzhalter-Balken).
- Der "Test Sound Pack"-Testartikel/Test-Track in Shopify sollte gelöscht
  werden, sobald echte Produkte drin sind.

## Erste Schritte lokal

```bash
npm install
npm run dev
```

Läuft danach gegen `mock.shop` (Testdaten, keine Anmeldung nötig).

### Mit deinem echten Store verbinden

```bash
npx shopify hydrogen link
npx shopify hydrogen env pull
```

Das öffnet einen Browser-Login-Flow (keine Passwörter im Terminal/Chat
nötig) und schreibt die echten Store-Variablen in `.env`.

### Auf GitHub pushen + Oxygen-Deploy aktivieren

1. Leeres GitHub-Repo anlegen, dann:
   ```bash
   git remote add origin <dein-repo-url>
   git push -u origin main
   ```
2. In Shopify Admin → Hydrogen-Storefront → Settings → Environments ein
   Deployment-Token erzeugen.
3. In GitHub → Repo Settings → Secrets and variables → Actions:
   Secret `OXYGEN_DEPLOYMENT_TOKEN` mit diesem Token anlegen.
4. Ab dem nächsten PR/Push läuft `.github/workflows/ci.yml` automatisch.

## Nächste Claude-Prompts (aus dem Bauplan)

Schritte 2–5 (Player-Prototyp, Shopify-Audiodaten, Produktkarten,
Persistenz-Feinschliff) sowie Favoriten, "Zuletzt gehört", eine
regelbasierte Empfehlungs-Engine und Kundenkonto + Onboarding-Quiz sind
erledigt. Offen aus dem ursprünglichen Bauplan:

1. **Design-Feinschliff:** Header ist erledigt (siehe oben). Als Nächstes:
   Produktkarten, Collections, Startseite und Account-/Präferenzen-Seiten
   auf die Sonic-Selection-Designsprache aus dem Mock-up bringen.
2. **Echte Waveform-Daten:** `Waveform.tsx`s Platzhalter-Balken durch
   tatsächliche Peak-Daten ersetzen (z. B. aus einer Audio-Analyse beim
   Track-Upload).
3. **Empfehlungs-Engine verfeinern:** aktuell regelbasiert (Genre + BPM);
   später ggf. auf Kaufverhalten/KI umstellen, wenn genug Daten da sind.
4. **Aufräumen:** "Test Sound Pack"-Testartikel in Shopify löschen, sobald
   echte Produkte vorhanden sind — Empfehlungen brauchen mindestens 2
   Produkte mit Genre/BPM, um überhaupt etwas anzuzeigen.
5. **Content-Pipeline:** echte Sound Packs mit Audiodateien einpflegen —
   nächster großer Block, siehe Vision unten.

## Ordnerstruktur (Player-relevant)

```
app/
├── components/audio/   GlobalPlayer, MiniPlayer, MobilePlayer, ExpandedPlayer,
│                       PlayerControls, ProgressBar, VolumeControl, Waveform,
│                       QueueDrawer, ProductPlayButton, FavoriteButton,
│                       RecentlyPlayedSection, RecommendedTracksSection,
│                       ForYouSection
├── stores/              playerStore, favoritesStore, historyStore
├── hooks/              useAudioEngine, useMediaSession, usePlayerPersistence,
│                       useFavoritesPersistence, useHistoryPersistence
├── services/           audioAnalytics, playerStorage, favoritesStorage,
│                       historyStorage
├── lib/                fragments.ts (AudioTracksMetafield-Fragment),
│                       audioTracks.ts (mapAudioTracks, toAudioProduct),
│                       musicGenres.ts (Onboarding-Quiz-Genreliste)
├── routes/              api.audio-products.tsx, api.recommendations.tsx,
│                       account.preferences.tsx (Onboarding-Quiz)
├── graphql/customer-account/   CustomerPreferencesMutation, CustomerIdQuery,
│                       CustomerMusicPreferencesQuery
└── types/audio.ts
docs/shopify-audio-track-metaobject.md
.github/workflows/ci.yml
```
