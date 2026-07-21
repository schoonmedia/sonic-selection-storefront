# Claude Prompt – Sonic Selection CI/CD Integration

Analysiere mein Shopify-Hydrogen-Projekt und integriere das Sonic-Selection-Designsystem als Grundlage.

Nutze die Dateien aus diesem Asset-Paket:

- design-tokens/sonic-selection.css
- design-tokens/sonic-selection.tokens.json
- svg/sonic-selection-logo-horizontal-white.svg
- svg/sonic-selection-favicon.svg
- icons/*.svg
- shopify-hydrogen/components/BrandLogo.tsx
- shopify-hydrogen/components/SonicProductCard.tsx
- shopify-hydrogen/components/GlobalPlayerShell.tsx

Wichtige Regeln:

1. Erstelle keinen kompletten Shop auf einmal.
2. Verändere zunächst keine Checkout- oder Cart-Logik.
3. Importiere zuerst nur die globalen CSS-Tokens.
4. Ersetze danach den Header mit dem Sonic-Selection-Logo.
5. Erstelle erst anschließend eine erste Homepage-Struktur im Stil des Mockups.
6. Der globale Player bleibt vorerst nur ein UI-Shell, bis die Audio-Engine separat gebaut wird.
7. Keine Font-Dateien einbinden, nur CSS-Font-Stacks verwenden.
8. Alle Änderungen SSR-sicher halten.
9. Erkläre vor jeder Änderung, welche Datei geändert wird und warum.
10. Nach jeder Stufe eine Testanleitung ausgeben.

Ziel der ersten Stufe:

- Dark UI
- Sonic-Selection-Header
- Hero-Bereich
- Category Cards
- New Release Cards
- Player Shell unten
- responsive Grundstruktur
