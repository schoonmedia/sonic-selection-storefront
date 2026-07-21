# Sonic Selection — Hydrogen Storefront (Phase 1)

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
  das "Audio Track"-Metaobjekt + GraphQL-Query-Entwurf für Phase 3.

Typecheck, Lint und Build wurden vor der Übergabe verifiziert (0 Errors).

## Was fehlt (bewusst, laut Bauplan)

- Anbindung an deinen echten Shopify-Store (aktuell läuft `.env` gegen
  Shopifys Mock-Shop, keine echten Zugangsdaten enthalten).
- Das "Audio Track"-Metaobjekt ist in Shopify Admin noch nicht angelegt
  (siehe `docs/shopify-audio-track-metaobject.md`).
- `ProductItem.tsx` hat nur einen Kommentar, wo `<ProductPlayButton>`
  später reinkommt — bewusst noch nicht verdrahtet, da die echten
  Track-Daten fehlen.
- Header/Produktkarten/Collections sind noch Skeleton-Standard, nicht das
  Sonic-Selection-Design aus dem Mock-up.
- `OXYGEN_DEPLOYMENT_TOKEN` ist noch nicht als GitHub Secret hinterlegt —
  die CI/CD-Deploy-Jobs laufen erst, wenn das gesetzt ist.

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

1. **Schritt 2 (Player-Prototyp testen):** 3 lokale MP3s in `public/` legen,
   `playerStore.loadProduct()` testweise mit Dummy-`AudioProduct`/`AudioTrack`
   aus einer Testseite aufrufen, Play/Pause/Skip/Lautstärke im Browser
   durchklicken.
2. **Schritt 3 (Shopify-Audiodaten):** Metaobject-Definition in Shopify
   Admin nach `docs/shopify-audio-track-metaobject.md` anlegen, dann
   `app/graphql/AudioTracksQuery.ts` erstellen und codegen laufen lassen
   (`npm run codegen`).
3. **Schritt 4 (Produktkarten):** `ProductItem.tsx` TODO auflösen —
   `<ProductPlayButton>` einbauen, sobald die Query echte Tracks liefert.
4. **Schritt 5 (Persistenz-Feinschliff):** `usePlayerPersistence` erweitern,
   damit `activeTrack`/`playlist` nach Reload aus den persistierten IDs neu
   geladen werden (aktuell wird nur Lautstärke/Position wiederhergestellt).

## Ordnerstruktur (Player-relevant)

```
app/
├── components/audio/   GlobalPlayer, MiniPlayer, MobilePlayer, ExpandedPlayer,
│                       PlayerControls, ProgressBar, VolumeControl, Waveform,
│                       QueueDrawer, ProductPlayButton
├── stores/playerStore.ts
├── hooks/              useAudioEngine, useMediaSession, usePlayerPersistence
├── services/           audioAnalytics, playerStorage
└── types/audio.ts
docs/shopify-audio-track-metaobject.md
.github/workflows/ci.yml
```
