# Shopify Metaobject: Audio Track

Dieses Dokument beschreibt, wie das Metaobjekt für Track-Previews in
Shopify Admin angelegt wird (Content > Metaobjects) und wie es per GraphQL
in Hydrogen abgefragt wird. Voraussetzung für Phase 3 (Schritt 3+4 im
Bauplan).

## 1. Metaobject-Definition anlegen

Shopify Admin → Settings → Custom data → Metaobjects → Add definition.

| Feldname (intern)   | Typ                          | Pflicht | Hinweis |
|----------------------|-------------------------------|---------|---------|
| `title`              | Single line text             | ja      | Track-Titel, z.B. "808 Mob - Hard 808" |
| `preview_url`        | File (oder URL)               | ja      | MP3/Audio-Preview. `File` erlaubt Shopify-CDN-Hosting inkl. `url`-Feld. |
| `duration_seconds`   | Integer                       | nein    | Fallback: Client liest Dauer aus dem Audio-Element (`loadedmetadata`). |
| `bpm`                | Integer                       | nein    | |
| `key`                | Single line text              | nein    | z.B. "F# Minor" |
| `genre`              | Single line text (oder Metaobject-Referenz auf eine Genre-Taxonomie) | nein | |
| `position`            | Integer                       | ja      | Sortierung innerhalb des Produkts. |
| `product`             | Product reference             | ja      | Verknüpfung zum zugehörigen Sound-Pack. |
| `download_url`        | File                          | nein    | **Vollqualitäts-Master** (WAV o.ä.) — bewusst getrennt von `preview_url`. Wird NIE über die öffentlichen Produkt-Queries abgefragt (siehe Sicherheitshinweis unten), sondern ausschließlich server-seitig in `app/routes/api.downloads.authorize.tsx`, nachdem Kauf/Free-Status geprüft wurde. Leer lassen, solange kein Master-File vorliegt — Drag-Handle blendet sich dann automatisch aus. |

Definition-Handle: `audio_track` (wird unten in der GraphQL-Query referenziert).

### Sicherheitshinweis zu `download_url`

`AUDIO_TRACK_FIELDS_FRAGMENT` (`app/lib/fragments.ts`) — die Fragment, die
auf Startseite, Collections, PDP und Empfehlungen läuft — fragt bewusst
**nicht** `download_url` ab. Deren Loader-Response landet im Client-Bundle;
jeder könnte die URL sonst einfach per "View Source" abgreifen, unabhängig
vom Kaufstatus. `download_url` wird ausschließlich in einer eigenen,
serverseitigen Query innerhalb der Download-Autorisierungs-Route abgefragt,
erst nachdem geprüft wurde, dass der Besucher das Produkt gekauft hat oder
es sich um ein Free-Pack handelt. Siehe
`docs/ableton-drag-and-drop.md` für den vollen Ablauf.

## 2. Verknüpfung zum Produkt

Zwei Optionen, je nachdem wie viele Tracks pro Produkt existieren:

1. **Metafield-Liste am Produkt** (empfohlen): Produkt-Metafield
   `custom.audio_tracks` vom Typ "List of Metaobject references" →
   zeigt auf alle `audio_track`-Einträge dieses Produkts. Einfachste
   Abfrage, ein Request pro Produktseite.
2. **Reverse-Referenz über das `product`-Feld im Metaobject** (siehe
   Tabelle oben) — nötig, falls Tracks unabhängig von einem Produkt
   verwaltet werden sollen (z.B. Umsortieren ohne Produkt-Edit).

Für Phase 1 reicht Option 1.

## 3. GraphQL Query (Storefront API)

```graphql
# app/graphql/AudioTracksQuery.ts
query ProductAudioTracks($handle: String!) {
  product(handle: $handle) {
    id
    handle
    title
    audioTracks: metafield(namespace: "custom", key: "audio_tracks") {
      references(first: 20) {
        nodes {
          ... on Metaobject {
            id
            title: field(key: "title") { value }
            previewUrl: field(key: "preview_url") {
              reference {
                ... on MediaImage { image { url } }
                ... on GenericFile { url }
              }
            }
            durationSeconds: field(key: "duration_seconds") { value }
            bpm: field(key: "bpm") { value }
            key: field(key: "key") { value }
            genre: field(key: "genre") { value }
            position: field(key: "position") { value }
          }
        }
      }
    }
  }
}
```

## 4. Mapping auf `AudioTrack` (app/types/audio.ts)

```ts
function mapMetaobjectToAudioTrack(node: MetaobjectNode, productId: string): AudioTrack {
  return {
    id: node.id,
    title: node.title?.value ?? 'Untitled',
    previewUrl: node.previewUrl?.reference?.url ?? '',
    duration: Number(node.durationSeconds?.value ?? 0),
    bpm: node.bpm?.value ? Number(node.bpm.value) : undefined,
    key: node.key?.value,
    genre: node.genre?.value,
    position: Number(node.position?.value ?? 0),
    productId,
  };
}
```

Sortieren nach `position` beim Aufbau der `playlist`, bevor sie an
`loadProduct()` im `playerStore` übergeben wird.

## 5. Offene Punkte für Claude-Prompt (Schritt 3)

- Metaobject-Definition per Shopify Admin API/CLI erzeugen (optional,
  sonst manuell im Admin anlegen).
- `AudioTracksQuery` in `app/graphql/` ablegen, per `shopify hydrogen codegen`
  Typen generieren.
- Loader in `app/routes/products.$handle.tsx` erweitern, Tracks laden und
  an `<ProductPlayButton>` / `GlobalPlayer.loadProduct()` durchreichen.
