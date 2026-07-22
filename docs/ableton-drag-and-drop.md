# Drag & Drop von Samples in die DAW (Ableton etc.)

Ziel: gekaufte oder kostenlose Samples lassen sich direkt aus dem Browser
per Drag & Drop in Ableton (oder eine andere DAW) ziehen, statt erst
herunterladen + entpacken + im Finder suchen zu müssen.

## Wie es technisch funktioniert

Chrome/Chromium (auch Edge) unterstützt einen undokumentierten, aber breit
genutzten HTML5-Drag-Mechanismus: setzt man beim `dragstart`-Event einen
speziell formatierten `DownloadURL`-Wert auf `event.dataTransfer`
(`MIME-Typ:Dateiname:URL`), lädt der Browser die Datei im Hintergrund und
übergibt sie dem Drop-Ziel als **echten Datei-Drag auf Betriebssystem-
Ebene** — Ableton sieht das genauso wie einen Drag aus dem Finder/Explorer.
Genau dieses Prinzip nutzen z. B. Box.net-Demos für "Datei aus Browser
aufs Desktop ziehen" (siehe `dt.in.th/DownloadURL`, `web.dev/case-studies/
box-dnd-download`).

Safari und Firefox unterstützen diesen MIME-Typ nicht und ignorieren ihn
folgenlos — dort greift kein Spezial-Drag, ein normaler Download-Link
sollte deshalb parallel verfügbar bleiben (nicht Teil dieser ersten
Ausbaustufe).

## Sicherheitsmodell

Ein Sample-Pack-Shop lebt von seinen Audiodateien — die dürfen nicht einfach
für jeden Besucher abrufbar sein, nur weil sie technisch im Storefront
existieren. Deshalb:

- **Zwei getrennte Datei-Felder pro Track:** `preview_url` (öffentlich,
  wird für den Player überall verwendet) und `download_url` (das
  Vollqualitäts-Master, nie öffentlich abgefragt). Siehe
  `docs/shopify-audio-track-metaobject.md`.
- **`download_url` wird ausschließlich serverseitig abgefragt**, in
  `app/routes/api.downloads.authorize.tsx`, und zwar erst NACHDEM geprüft
  wurde, dass der Besucher berechtigt ist. Die öffentliche Produktseite
  bekommt diese URL nie in ihre Loader-Response — sonst stünde sie im
  Page-Source für jeden sichtbar.
- **Berechtigung** = Produkt ist im "Free"-Collection ODER der eingeloggte
  Kunde hat eine Order mit diesem Produkt (Prüfung über die Customer
  Account API, letzte 50 Orders). Kein Login + kein Free-Pack → 401, keine
  URL wird ausgeliefert.
- **Kein echtes Signing/Expiry:** Shopifys Storefront-CDN-Datei-URLs haben
  kein eingebautes Ablaufdatum. Wer die URL einmal legitim erhalten hat,
  könnte sie theoretisch weitergeben — dasselbe Risiko wie bei jedem
  digitalen Download auf Shopify. Für den Start akzeptabel; bei Bedarf
  später durch einen echten signierten Proxy (eigener Worker-Endpunkt,
  der die Datei durchreicht statt die CDN-URL preiszugeben) verschärfbar.

## Beteiligte Dateien

- `app/routes/api.downloads.authorize.tsx` — Autorisierungs-Route.
- `app/hooks/useDownloadAuthorization.ts` — Client-Hook, fragt beim Laden
  der Produktseite ab, welche Tracks dieser Besucher downloaden darf.
- `app/components/audio/DragToDaw.tsx` — der eigentliche Drag-Handle.
- `app/routes/products.$handle.tsx` — Tracklist rendert pro Zeile einen
  Drag-Handle, wenn die Autorisierung ihn für diesen Track freigibt.

## Offene Punkte / nächste Ausbaustufe

- `download_url`-Feld muss im Shopify Admin am `audio_track`-Metaobject
  ergänzt und mit echten Master-Files befüllt werden (sobald Tims Packs
  da sind — siehe `docs/sound-pack-ingestion-workflow.md`).
- Fallback-Download-Button für Safari/Firefox.
- Multi-Select-Drag ("mehrere Samples auf einmal ziehen", wie bei Splice)
  — aktuell ein Handle pro Track.
- Später: Kaufprüfung auf Kunden-ID statt nur Session, sobald Playlists/
  Profil (siehe Plattform-Roadmap) eine Kunden-übergreifende Bibliothek
  brauchen.
