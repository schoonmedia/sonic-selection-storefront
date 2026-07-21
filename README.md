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
- **CI/CD** (`.github/workflows/ci.yml`): Lint + Typecheck + Build auf jedem
  PR, Preview-Deploy auf Oxygen für PRs, Production-Deploy auf Oxygen bei
  Push auf `main`.
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
- **CI/CD** (`.github/workflows/ci.yml`): Lint + Typecheck + Build auf jedem
  PR, Preview-Deploy auf Oxygen für PRs, Production-Deploy auf Oxygen bei
  Push auf `main`. Läuft grün, verbunden mit dem echten Store.

Typecheck, Lint und Build wurden vor jeder Übergabe verifiziert (0 Errors).

## Was fehlt (bewusst, laut Bauplan)

- Header/Produktkarten/Collections sind noch Skeleton-Standard, nicht das
  volle Sonic-Selection-Design aus dem Mock-up (nur der Player selbst hat
  die eigene Designsprache).
- Echte Waveform-Peak-Daten (`Waveform.tsx` zeigt aktuell Platzhalter-Balken).
- Favoriten, "Zuletzt gehört" / Continue-Listening, Empfehlungs-Engine —
  noch nicht begonnen.
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
Persistenz-Feinschliff) sind erledigt. Offen aus dem ursprünglichen Bauplan:

1. **Design-Feinschliff:** Header/Produktkarten/Collections auf die
   Sonic-Selection-Designsprache aus dem Mock-up bringen (aktuell noch
   Skeleton-Standard-Layout).
2. **Echte Waveform-Daten:** `Waveform.tsx`s Platzhalter-Balken durch
   tatsächliche Peak-Daten ersetzen (z. B. aus einer Audio-Analyse beim
   Track-Upload).
3. **Favoriten:** Herz-Button auf Produktkarte/PDP, Speicherung (Metafield
   auf Customer oder eigener Storage), Übersichtsseite.
4. **Zuletzt gehört / Continue-Listening:** eigener Verlauf (mehr als nur
   der zuletzt aktive Track), Startseiten-Sektion.
5. **Empfehlungs-Engine:** erst regelbasiert (gleiches Genre/BPM-Bereich),
   später ggf. KI-gestützt.
6. **Aufräumen:** "Test Sound Pack"-Testartikel in Shopify löschen, sobald
   echte Produkte vorhanden sind.

## Ordnerstruktur (Player-relevant)

```
app/
├── components/audio/   GlobalPlayer, MiniPlayer, MobilePlayer, ExpandedPlayer,
│                       PlayerControls, ProgressBar, VolumeControl, Waveform,
│                       QueueDrawer, ProductPlayButton
├── stores/playerStore.ts
├── hooks/              useAudioEngine, useMediaSession, usePlayerPersistence
├── services/           audioAnalytics, playerStorage
├── lib/                fragments.ts (AudioTracksMetafield-Fragment),
│                       audioTracks.ts (mapAudioTracks, toAudioProduct)
├── routes/api.audio-products.tsx   Server-Route für Persistenz-Rehydration
└── types/audio.ts
docs/shopify-audio-track-metaobject.md
.github/workflows/ci.yml
```
