# Sound-Pack-Anlieferung von Tim → Sonic Selection: Workflow

Status: Entwurf. Basiert auf zwei bekannten Eckdaten: Tim liefert **ZIPs und Einzeldateien gemischt**, Ablage erfolgt über einen **Cloud-Ordner (Dropbox/Google Drive/OneDrive)**. Bevor das automatisiert läuft, fehlen noch der konkrete Freigabelink und ein paar Absprachen mit Tim (siehe „Offene Punkte" unten).

## 1. Vorgabe an Tim (Ordnerstruktur + Naming)

Damit sich der Sync automatisieren lässt, sollte Tim sich an ein festes Schema halten. Vorschlag:

```
/Sonic Selection Delivery/
  /2026-07-Dark-Trap-Vol-6/
    pack-info.txt          ← Titel, Genre, BPM-Range, Preis-Idee, Cover (optional)
    cover.jpg
    Dark-Trap-Vol-6.zip    ← ODER einzelne Dateien direkt im Ordner
    01-kick-808.wav
    02-snare-trap.wav
    ...
```

Ein Ordner = ein Pack = ein zukünftiges Shopify-Produkt. Ob er das Pack als ZIP oder als Einzeldateien ablegt, ist für den Sync egal, solange jeder Pack-Ordner klar benannt ist (Datum + Titel) und eine `pack-info.txt` (oder ähnliches) mit Titel/Genre/BPM mitkommt — das erspart uns das Nachfragen bei jeder Lieferung.

## 2. Sync-Mechanik (Cloud-Ordner → Staging)

Empfehlung: **rclone** — ein CLI-Tool, das Dropbox, Google Drive und OneDrive einheitlich als Remote behandelt. Einmalig einrichten, danach läuft der Sync mit einem einzeiligen Befehl bzw. automatisiert per Cronjob/GitHub Action.

Einrichtung (einmalig, je nachdem welchen Dienst Tim nutzt):

```bash
rclone config
# wählt z.B. "Dropbox" oder "Google Drive" oder "OneDrive"
# folgt dem OAuth-Login-Flow im Browser
```

Danach reicht:

```bash
rclone sync "tim-dropbox:/Sonic Selection Delivery" ./staging/incoming --progress
```

Das zieht nur neue/geänderte Dateien nach, überschreibt nichts bei uns, das Tim nicht auch bei sich verändert hat.

## 3. Verarbeitung im Staging

Pro neuem Pack-Ordner:

1. Falls ZIP vorhanden → entpacken, ZIP behalten als Backup.
2. Dateinamen normalisieren (kleinschreiben, Leerzeichen → Bindestriche) — vermeidet Probleme bei späterem Upload.
3. `pack-info.txt` auslesen (oder händisch ergänzen, falls Tim sie vergessen hat) für: Titel, Genre/Tags, BPM, Cover.
4. Audio-Dateien kurz gegenchecken (Format WAV/MP3, keine 0-Byte-Dateien, Sample-Anzahl plausibel).

## 4. Upload nach Shopify

Zwei Teile, die zusammengehören:

- **Produkt-Datensatz** (Titel, Preis, Beschreibung, Genre-Tag, Cover) → entweder manuell im Shopify Admin oder per CSV-Import/Admin-API, wenn das Volumen zunimmt.
- **Die eigentlichen Audio-Dateien** (Sample-Previews/Downloads) → Shopify Files (Admin → Content → Files), dort landen sie mit einer CDN-URL, die wir dann im Produkt bzw. im `audio_tracks`-Metafield referenzieren (das Metaobject-Schema dafür existiert bereits, siehe `docs/shopify-audio-track-metaobject.md`).

## 5. Automatisierungs-Ausblick

Sobald der Ordnerlink von Tim feststeht, lässt sich Schritt 2 (Sync) als wiederkehrende Aufgabe einrichten (z. B. „jeden Morgen prüfen, ob neue Pack-Ordner da sind, mich benachrichtigen"). Schritt 3–4 (Verarbeitung + Shopify-Upload) können wir schrittweise automatisieren — erst als Skript, das ich manuell anstoße, später ggf. vollautomatisch bei neuem Ordner. Das baue ich, sobald die Eckdaten unten geklärt sind.

## 6. Offene Punkte (brauche ich noch von dir/Tim)

- Konkreter Freigabelink zum Cloud-Ordner (Dropbox/Drive/OneDrive-Freigabe) bzw. Einladung eines geteilten Ordners.
- Ist Tim bereit, sich an eine Ordnerstruktur/Naming-Konvention zu halten (siehe Abschnitt 1), oder müssen wir mit unregelmäßiger Ablage rechnen?
- Liefert er Metadaten (BPM, Genre, Key) strukturiert mit, oder müssen wir die aus den Dateinamen/Preview anhören ableiten?
- Cover-Bilder: liefert er die mit, oder sourcen/erstellen wir die wie bisher selbst?
