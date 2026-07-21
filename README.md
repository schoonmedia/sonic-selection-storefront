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

- **Design-Feinschliff (Header + Navigation):** Header läuft auf dem
  Sonic-Selection-Farbschema (Jet Black, Slate-Trennlinie, Lime als aktive/
  Hover-Farbe) — Logo, Menü, Account-Link, Favoriten-Herz, Suche und
  Warenkorb-Badge.
- **Design-Feinschliff (Produktkarten + Collections):** Produktkarten
  (Startseite, Collections, Favoriten), Collection-Kacheln und das
  Featured-Collection-Banner sind dunkle Cards im Corporate Design
  (Graphite-Hintergrund, Slate-Rahmen, Lime-Hover-Kante, Gold als
  Preis-Akzent).
- **Design-Feinschliff (Cart-/Search-/Mobile-Aside):** das ausklappende
  Seitenpanel (Warenkorb, Suche, Mobile-Menü) läuft auf Graphite/Slate/Lime
  — inkl. dunkler Inputs und Lime-Buttons für "Apply"/"Remove"/Checkout.
  Dabei einen echten Bug gefunden und behoben: der Header hatte denselben
  z-index wie das Overlay, wodurch der Header beim Öffnen des Asides
  drübergelegen hätte statt dahinter zu verschwinden.
- **Echtes Logo + Favicon:** offizielles Brand-Asset-Kit erhalten
  (`docs/brand-assets/`) — Logo-Mark läuft als `<BrandLogo>`-Komponente im
  Header (SVG, `currentColor`, erbt die Hover-Farbe des Links) statt des
  Platzhaltertexts "My Store". Favicon ist der offizielle Lime-Mark.
  `--ss-font-display`/`--ss-font-body`-Tokens aus dem Kit ergänzt (nur
  Font-Stacks, keine Font-Dateien — Lizenzhinweis im Kit beachtet).
- **Kompletter Dark-Mode:** die ganze Seite läuft jetzt auf Jet Black statt
  nur einzelne Bereiche (`body` selbst ist jetzt dunkel, per offiziellem
  Brand-Kit-Vorgabe) — Fußzeile, Warenkorb-Seite/-Zeilen, Suchergebnisse,
  Produktoptionen/Varianten-Swatches, Account-Menü und -Formulare
  (Bestellungen, Adressen, Profil), "Add to cart"/Checkout-Buttons (neue
  `.ss-button-primary`-Klasse, Lime gefüllt) sind mit umgestellt. Globale
  Basis-Overrides (`a`, `hr`, `input`, `code`) sorgen dafür, dass auch noch
  nicht einzeln gestylte Skeleton-Reste automatisch lesbar bleiben.

## Was fehlt (bewusst, laut Bauplan)

- Startseiten-Layout im engeren Sinn (Hero-Bereich, Kategorie-Kacheln nach
  Wireframe) ist noch nicht gebaut — aktuell nur Featured-Collection-Banner
  + Produkt-Grids, kein eigener Hero. Referenz: `docs/brand-assets/previews/
  homepage-wireframe.png`.
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

1. **Design-Feinschliff:** kompletter Dark-Mode inkl. Header, Produktkarten/
   Collections, Cart-/Search-/Mobile-Aside, Footer, Account-Seiten und
   echtem Logo ist erledigt (siehe oben). Als Nächstes: ein echter
   Hero-Bereich + Kategorie-Kacheln auf der Startseite nach
   `docs/brand-assets/previews/homepage-wireframe.png` — dafür fehlen noch
   Kategorie-Daten (Drum Kits, Melody Loops, One Shots, ...) in Shopify.
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
