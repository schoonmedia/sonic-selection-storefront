# Claude Prompt – Global Player Prototype

Analysiere dieses Shopify-Hydrogen-Projekt.

Erstelle noch keinen vollständigen Shop und verändere keine bestehenden Commerce-Funktionen.

Ziel ist zunächst ein globaler Audio-Player-Prototyp.

Anforderungen:

- TypeScript
- eine einzige HTMLAudioElement-Instanz
- Zustand als globaler State
- Player im Root Layout
- Play und Pause
- Fortschrittsanzeige
- Lautstärkeregelung
- ein lokaler Testtrack aus `/public/audio`
- keine Waveform
- keine Queue
- keine Shopify-Metaobjekte
- keine Analytics
- SSR-sicher: kein Zugriff auf `window`, `Audio` oder `localStorage` auf dem Server
- Event Listener sauber registrieren und entfernen
- keine doppelten Audioinstanzen

Erkläre vor jeder Änderung:

1. Welche Dateien verändert werden.
2. Warum sie verändert werden.
3. Wie die Funktion anschließend getestet wird.

Erstelle anschließend die Dateien einzeln.
