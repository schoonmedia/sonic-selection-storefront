# Sonic Selection – Brand Assets Starter Kit

Dieses Paket enthält die ersten CI/CD-Assets für den Shopify-Hydrogen-Aufbau von **Sonic Selection**.

## Enthalten

- SVG-Logos: horizontal, stacked, mark, favicon
- Icon-Set für Shop-Kategorien und Player-Funktionen
- Farb- und Design-Tokens als JSON, CSS und Tailwind-Erweiterung
- Shopify/Hydrogen-Komponenten als Startpunkt
- Preview-Dateien für Brand und Homepage
- Claude-Prompts für Integration und globalen Player
- Referenzbilder aus dem aktuellen Konzept

## Hauptfarben

- Jet Black: `#0B0B0D`
- Graphite: `#16161A`
- Dark Slate: `#2A2A31`
- Light: `#F2F2F4`
- Electric Lime: `#C6FF00`
- Gold: `#D4AF7A`

## Typography

Empfehlung:

- Display: Clash Display, Orbitron, Space Grotesk oder Arial Black als Fallback
- Body: Inter oder system-ui

Wichtig: Es sind bewusst keine Font-Dateien enthalten. Verwende nur Fonts, für die du eine gültige Lizenz hast.

## Shopify/Hydrogen

Nutze zunächst:

- `shopify-hydrogen/styles/sonic-theme.css`
- `shopify-hydrogen/components/BrandLogo.tsx`
- `shopify-hydrogen/components/SonicProductCard.tsx`
- `shopify-hydrogen/components/GlobalPlayerShell.tsx`

Diese Dateien sind Starter-Komponenten. Der echte globale Player wird danach modular mit Zustand und einer einzigen `HTMLAudioElement`-Instanz aufgebaut.
