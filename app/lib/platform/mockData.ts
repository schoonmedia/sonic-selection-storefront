import type {
  Producer,
  Project,
  Story,
  SonicProduct,
  PlatformAudioTrack,
} from './types';

/**
 * Phase 1 mock content for the platform layer (Producers, Projects,
 * Stories, Artist Packs). Sourced from the "Sonic Selection Platform & FPC
 * Architecture" briefing package. Producer portraits/hero images and product
 * covers are real local files under `/assets/...` (see docs/platform/README.md).
 * Project hero images and Story cover images are example/demo photography
 * hotlinked from Unsplash (free license, no attribution required) — a
 * placeholder-quality illustration of every category per the July 2026
 * briefing, to be swapped for real Sonic Selection photography later.
 * `audio/...` paths remain unresolved placeholders; PlatformPlayButton
 * degrades gracefully when a track file 404s.
 *
 * Six projects mirror the full route map from the briefing's
 * routes-and-navigation.md so every `/projects/:handle` link resolves.
 */

export const projects: Project[] = [
  {
    id: 'female-producer-collective',
    title: 'Female* Producer Collective',
    handle: 'female-producer-collective',
    type: 'flagship_project',
    shortDescription:
      'An official Sonic Selection flagship project supporting visibility, education and community for female* producers.',
    description:
      'Female* Producer Collective is one of Sonic Selection’s official flagship projects. It supports visibility, education, mentoring, workshops and community for female* producers.',
    heroImage:
      'https://cdn.shopify.com/s/files/1/1032/2893/2439/files/photo-1601814923576-019b567be073.jpg?v=1784710471',
    logoImage: '/assets/logos/fpc-logo.png',
    relatedProducerIds: ['nova-kane', 'lyra-voss'],
    relatedStoryIds: ['inside-fpc', 'producer-visibility-matters'],
    relatedProductIds: ['nova-kane-vol-1', 'lyra-voss-vol-1'],
    audioTrackIds: ['nova-kane-preview', 'lyra-voss-preview'],
    cta: {
      label: 'Explore FPC',
      href: '/projects/female-producer-collective',
    },
  },
  {
    id: 'artist-collaborations',
    title: 'Artist Collaborations',
    handle: 'artist-collaborations',
    type: 'artist_collaboration',
    shortDescription:
      'Cinematic artist pack drops from selected producers and sound designers — also known as the Sonic Selection Artist Series.',
    description:
      'Artist Collaborations (the Sonic Selection Artist Series) features producers across genres with curated sound packs, stories and global player previews.',
    heroImage:
      'https://cdn.shopify.com/s/files/1/1032/2893/2439/files/photo-1618609377864-68609b857e90.jpg?v=1784710653',
    relatedProducerIds: [
      'kai-noir',
      'mika-sol',
      'nova-kane',
      'lyra-voss',
      'zay-velar',
      'aria-blaze',
      'jet-marrow',
      'selene-ray',
      'romeo-vex',
      'tala-drift',
    ],
    relatedStoryIds: ['behind-nova-kane-vol-1', 'kai-noir-artist-pack-story', 'mika-sol-sound-design'],
    relatedProductIds: [
      'kai-noir-vol-1',
      'mika-sol-vol-1',
      'nova-kane-vol-1',
      'lyra-voss-vol-1',
      'zay-velar-vol-1',
      'aria-blaze-vol-1',
      'jet-marrow-vol-1',
      'selene-ray-vol-1',
      'romeo-vex-vol-1',
      'tala-drift-vol-1',
    ],
    audioTrackIds: [
      'kai-noir-preview',
      'mika-sol-preview',
      'nova-kane-preview',
      'lyra-voss-preview',
      'zay-velar-preview',
      'aria-blaze-preview',
      'jet-marrow-preview',
      'selene-ray-preview',
      'romeo-vex-preview',
      'tala-drift-preview',
    ],
  },
  {
    id: 'sonic-sessions',
    title: 'Sonic Sessions',
    handle: 'sonic-sessions',
    type: 'session',
    shortDescription: 'Live and recorded studio sessions from Sonic Selection producers.',
    description:
      'Sonic Sessions documents producers at work — studio recaps, session breakdowns and the stories behind how a pack came together.',
    heroImage:
      'https://cdn.shopify.com/s/files/1/1032/2893/2439/files/photo-1627773755683-dfcf2774596a.jpg?v=1784710720',
    relatedProducerIds: ['nova-kane', 'kai-noir'],
    relatedStoryIds: ['first-sonic-session-recap'],
    relatedProductIds: [],
    audioTrackIds: [],
  },
  {
    id: 'community-drops',
    title: 'Community Drops',
    handle: 'community-drops',
    type: 'community_drop',
    shortDescription: 'Community-driven pack drops and collaborative releases.',
    description:
      'Community Drops highlights packs and collaborations shaped directly by the Sonic Selection producer community.',
    heroImage:
      'https://cdn.shopify.com/s/files/1/1032/2893/2439/files/photo-1634650254521-b1596c5a2d37.jpg?v=1784710746',
    relatedProducerIds: [],
    relatedStoryIds: [],
    relatedProductIds: [],
    audioTrackIds: [],
  },
  {
    id: 'workshops-meetings',
    title: 'Workshops & Meetings',
    handle: 'workshops-meetings',
    type: 'workshop',
    shortDescription:
      'Meetings, workshops and community formats for producer culture.',
    description:
      'Workshops and meetings are the first education layer before deeper tutorial formats are added later.',
    heroImage:
      'https://cdn.shopify.com/s/files/1/1032/2893/2439/files/photo-1560831340-b9679dc9e9f0.jpg?v=1784710793',
    relatedProducerIds: ['nova-kane', 'kai-noir'],
    relatedStoryIds: ['first-sonic-session-recap'],
    relatedProductIds: [],
    audioTrackIds: [],
  },
  {
    id: 'education-resources',
    title: 'Education / Resources',
    handle: 'education-resources',
    type: 'education',
    shortDescription: 'Guides and resources supporting producers at every stage.',
    description:
      'Education / Resources bundles guides, references and recommended reading for producers — a foundation for the deeper tutorial format planned for a later phase.',
    heroImage:
      'https://cdn.shopify.com/s/files/1/1032/2893/2439/files/photo-1596633313465-1256feb1c6d9.jpg?v=1784710852',
    relatedProducerIds: [],
    relatedStoryIds: [],
    relatedProductIds: [],
    audioTrackIds: [],
  },
];

export const producers: Producer[] = [
  {
    id: 'nova-kane',
    name: 'Nova Kane',
    handle: 'nova-kane',
    portrait: '/assets/producers/nova-kane.jpg',
    heroImage: '/assets/producers/nova-kane-hero.jpg',
    bio: 'Nova Kane is a producer and sound designer known for dark, cinematic club textures and punchy drum programming.',
    shortBio: 'Dark cinematic club textures and punchy drums.',
    genres: ['Trap', 'Dark Pop', 'Club'],
    location: 'Berlin',
    affiliations: [
      {
        projectId: 'female-producer-collective',
        projectHandle: 'female-producer-collective',
        label: 'Female* Producer Collective',
        role: 'member',
        isPrimary: true,
      },
      {
        projectId: 'artist-collaborations',
        projectHandle: 'artist-collaborations',
        label: 'Sonic Selection Artist Series',
        role: 'featured_artist',
      },
    ],
    featuredProductIds: ['nova-kane-vol-1'],
    storyIds: ['inside-fpc', 'behind-nova-kane-vol-1'],
    audioTrackIds: ['nova-kane-preview'],
    socialLinks: {
      instagram: 'https://instagram.com/novakane',
      spotify: 'https://open.spotify.com/artist/novakane',
      soundcloud: 'https://soundcloud.com/novakane',
    },
  },
  {
    id: 'kai-noir',
    name: 'Kai Noir',
    handle: 'kai-noir',
    portrait: '/assets/producers/kai-noir.jpg',
    heroImage: '/assets/producers/kai-noir-hero.jpg',
    bio: 'Kai Noir creates heavy urban drums, cold melodies and high-impact artist pack material for modern producers.',
    shortBio: 'Heavy urban drums and cold melodies.',
    genres: ['Trap', 'Drill', '808'],
    location: 'London',
    // No FPC affiliation entry — Kai Noir appears on Sonic Selection
    // globally, but must never be shown inside an FPC-filtered module.
    affiliations: [
      {
        projectId: 'artist-collaborations',
        projectHandle: 'artist-collaborations',
        label: 'Sonic Selection Artist Series',
        role: 'featured_artist',
        isPrimary: true,
      },
    ],
    featuredProductIds: ['kai-noir-vol-1'],
    storyIds: ['kai-noir-artist-pack-story'],
    audioTrackIds: ['kai-noir-preview'],
    socialLinks: {
      instagram: 'https://instagram.com/kainoir',
      soundcloud: 'https://soundcloud.com/kainoir',
      youtube: 'https://youtube.com/@kainoir',
    },
  },
  {
    id: 'mika-sol',
    name: 'Mika Sol',
    handle: 'mika-sol',
    portrait: '/assets/producers/mika-sol.jpg',
    heroImage: '/assets/producers/mika-sol-hero.jpg',
    bio: 'Mika Sol blends glossy electronic textures, house grooves and atmospheric melodies.',
    shortBio: 'Glossy electronic textures and house grooves.',
    genres: ['House', 'Electronic', 'Pop'],
    location: 'Amsterdam',
    // No FPC affiliation entry — same rule as above.
    affiliations: [
      {
        projectId: 'artist-collaborations',
        projectHandle: 'artist-collaborations',
        label: 'Sonic Selection Artist Series',
        role: 'featured_artist',
        isPrimary: true,
      },
    ],
    featuredProductIds: ['mika-sol-vol-1'],
    storyIds: ['mika-sol-sound-design'],
    audioTrackIds: ['mika-sol-preview'],
    socialLinks: {
      instagram: 'https://instagram.com/mikasol',
      spotify: 'https://open.spotify.com/artist/mikasol',
      website: 'https://mikasol.example',
    },
  },
  {
    id: 'lyra-voss',
    name: 'Lyra Voss',
    handle: 'lyra-voss',
    portrait: '/assets/producers/lyra-voss.jpg',
    heroImage: '/assets/producers/lyra-voss-hero.jpg',
    bio: 'Lyra Voss makes sleek, high-precision electronic music built for late-night club systems, favoring tension and negative space over noise.',
    shortBio: 'High-precision electronic textures for late-night club systems.',
    genres: ['Electronic', 'Techno', 'Club'],
    location: 'Paris',
    affiliations: [
      {
        projectId: 'female-producer-collective',
        projectHandle: 'female-producer-collective',
        label: 'Female* Producer Collective',
        role: 'member',
        isPrimary: true,
      },
      {
        projectId: 'artist-collaborations',
        projectHandle: 'artist-collaborations',
        label: 'Sonic Selection Artist Series',
        role: 'featured_artist',
      },
    ],
    featuredProductIds: ['lyra-voss-vol-1'],
    storyIds: [],
    audioTrackIds: ['lyra-voss-preview'],
  },
  {
    id: 'zay-velar',
    name: 'Zay Velar',
    handle: 'zay-velar',
    portrait: '/assets/producers/zay-velar.jpg',
    heroImage: '/assets/producers/zay-velar-hero.jpg',
    bio: 'Zay Velar produces high-impact trap and hip-hop instrumentals built around heavy low end and razor-sharp hi-hats.',
    shortBio: 'Heavy low end and razor-sharp hi-hats.',
    genres: ['Trap', 'Hip-Hop'],
    location: 'Atlanta',
    // No FPC affiliation entry — appears on Sonic Selection globally, never inside an FPC-filtered module.
    affiliations: [
      {
        projectId: 'artist-collaborations',
        projectHandle: 'artist-collaborations',
        label: 'Sonic Selection Artist Series',
        role: 'featured_artist',
        isPrimary: true,
      },
    ],
    featuredProductIds: ['zay-velar-vol-1'],
    storyIds: [],
    audioTrackIds: ['zay-velar-preview'],
  },
  {
    id: 'aria-blaze',
    name: 'Aria Blaze',
    handle: 'aria-blaze',
    portrait: '/assets/producers/aria-blaze.jpg',
    heroImage: '/assets/producers/aria-blaze-hero.jpg',
    bio: 'Aria Blaze blends dark-pop songwriting sensibility with trap-influenced production, built for vocalists who want atmosphere without losing punch.',
    shortBio: 'Dark-pop songwriting meets trap-influenced production.',
    genres: ['Dark Pop', 'Trap'],
    location: 'Los Angeles',
    // No FPC affiliation entry — membership is explicit-data-only, never inferred from the cover art.
    affiliations: [
      {
        projectId: 'artist-collaborations',
        projectHandle: 'artist-collaborations',
        label: 'Sonic Selection Artist Series',
        role: 'featured_artist',
        isPrimary: true,
      },
    ],
    featuredProductIds: ['aria-blaze-vol-1'],
    storyIds: [],
    audioTrackIds: ['aria-blaze-preview'],
  },
  {
    id: 'jet-marrow',
    name: 'Jet Marrow',
    handle: 'jet-marrow',
    portrait: '/assets/producers/jet-marrow.jpg',
    heroImage: '/assets/producers/jet-marrow-hero.jpg',
    bio: 'Jet Marrow builds retro-futuristic synthwave textures and driving electronic grooves, indebted to ’80s synths and modern sound design.',
    shortBio: 'Retro-futuristic synths, modern sound design.',
    genres: ['Synthwave', 'Electronic'],
    location: 'Los Angeles',
    affiliations: [
      {
        projectId: 'artist-collaborations',
        projectHandle: 'artist-collaborations',
        label: 'Sonic Selection Artist Series',
        role: 'featured_artist',
        isPrimary: true,
      },
    ],
    featuredProductIds: ['jet-marrow-vol-1'],
    storyIds: [],
    audioTrackIds: ['jet-marrow-preview'],
  },
  {
    id: 'selene-ray',
    name: 'Selene Ray',
    handle: 'selene-ray',
    portrait: '/assets/producers/selene-ray.jpg',
    heroImage: '/assets/producers/selene-ray-hero.jpg',
    bio: 'Selene Ray crafts moody, cinematic R&B soundscapes built for late-night sessions and emotionally driven vocal work.',
    shortBio: 'Moody, cinematic R&B soundscapes.',
    genres: ['R&B', 'Cinematic'],
    location: 'Toronto',
    affiliations: [
      {
        projectId: 'artist-collaborations',
        projectHandle: 'artist-collaborations',
        label: 'Sonic Selection Artist Series',
        role: 'featured_artist',
        isPrimary: true,
      },
    ],
    featuredProductIds: ['selene-ray-vol-1'],
    storyIds: [],
    audioTrackIds: ['selene-ray-preview'],
  },
  {
    id: 'romeo-vex',
    name: 'Romeo Vex',
    handle: 'romeo-vex',
    portrait: '/assets/producers/romeo-vex.jpg',
    heroImage: '/assets/producers/romeo-vex-hero.jpg',
    bio: 'Romeo Vex specializes in melodic trap loops, drums and presets built for producers chasing an emotional, radio-ready sound.',
    shortBio: 'Melodic trap loops built for a radio-ready sound.',
    genres: ['Melodic Trap', 'R&B'],
    location: 'Miami',
    affiliations: [
      {
        projectId: 'artist-collaborations',
        projectHandle: 'artist-collaborations',
        label: 'Sonic Selection Artist Series',
        role: 'featured_artist',
        isPrimary: true,
      },
    ],
    featuredProductIds: ['romeo-vex-vol-1'],
    storyIds: [],
    audioTrackIds: ['romeo-vex-preview'],
  },
  {
    id: 'tala-drift',
    name: 'Tala Drift',
    handle: 'tala-drift',
    portrait: '/assets/producers/tala-drift.jpg',
    heroImage: '/assets/producers/tala-drift-hero.jpg',
    bio: 'Tala Drift fuses Afrobeats rhythm and Amapiano log-drum grooves into sample packs built for a global, dancefloor-ready sound.',
    shortBio: 'Afrobeats rhythm meets Amapiano log-drum grooves.',
    genres: ['Afrobeats', 'Amapiano'],
    location: 'Lagos',
    affiliations: [
      {
        projectId: 'artist-collaborations',
        projectHandle: 'artist-collaborations',
        label: 'Sonic Selection Artist Series',
        role: 'featured_artist',
        isPrimary: true,
      },
    ],
    featuredProductIds: ['tala-drift-vol-1'],
    storyIds: [],
    audioTrackIds: ['tala-drift-preview'],
  },
];

export const stories: Story[] = [
  {
    id: 'inside-fpc',
    title: 'Inside Female* Producer Collective',
    slug: 'inside-female-producer-collective',
    category: 'projects',
    excerpt:
      'How one of Sonic Selection’s flagship projects supports visibility, education and community.',
    coverImage:
      'https://cdn.shopify.com/s/files/1/1032/2893/2439/files/photo-1611532736579-6b16e2b50449.jpg?v=1784710883',
    publishedAt: '2026-07-22',
    authorName: 'Sonic Selection',
    relatedProducerIds: ['nova-kane'],
    relatedProjectIds: ['female-producer-collective'],
    relatedProductIds: [],
    audioTrackIds: [],
    content:
      'Female* Producer Collective started as a simple question inside Sonic Selection: who gets to be visible in producer culture, and why? The answer became a program — visibility, education, mentoring, workshops and network, built directly into the platform rather than bolted on as a separate initiative.\n\n' +
      'FPC producers are Sonic Selection producers first. Their packs sit in the same catalog, their profiles use the same system, their stories run in the same feed as everyone else\'s. What FPC adds is a dedicated space for community and mentorship — regular sessions, shared resources and a growing network of producers who show up for each other.\n\n' +
      'Nova Kane was one of the first to join. "It\'s not about being separated out," she says. "It\'s about having people in your corner who get exactly what you\'re building, and a platform that puts that in front of the right ears."',
  },
  {
    id: 'producer-visibility-matters',
    title: 'Why Producer Visibility Matters',
    slug: 'why-producer-visibility-matters',
    category: 'industry_culture',
    excerpt:
      'Producer culture is bigger than credits. Visibility shapes careers, collaborations and access.',
    coverImage:
      'https://cdn.shopify.com/s/files/1/1032/2893/2439/files/photo-1601814837661-ce2832acd413.jpg?v=1784710933',
    publishedAt: '2026-07-22',
    authorName: 'Sonic Selection',
    relatedProducerIds: ['nova-kane', 'kai-noir'],
    relatedProjectIds: ['female-producer-collective'],
    relatedProductIds: [],
    audioTrackIds: [],
    content:
      'Credits are a starting point, not the finish line. A producer can ship a placement and still stay invisible — buried in liner notes, absent from the story anyone tells about how a record actually got made.\n\n' +
      'Visibility changes what happens next: who gets the follow-up call, who gets invited into the room, who a label thinks of first when a brief comes in. Sonic Selection treats producer profiles, stories and artist packs as one connected system for exactly this reason — a pack is also a byline, and a byline is also a body of work you can point to.\n\n' +
      '"The most useful thing anyone did for my career was just tell people my name attached to my sound," Kai Noir notes. "Everything after that got easier."',
  },
  {
    id: 'behind-nova-kane-vol-1',
    title: 'Behind the Pack: Nova Kane Vol. 1',
    slug: 'behind-nova-kane-vol-1',
    category: 'behind_the_pack',
    excerpt:
      'A look into the sonic identity behind Nova Kane’s first Sonic Selection artist pack.',
    coverImage:
      'https://cdn.shopify.com/s/files/1/1032/2893/2439/files/photo-1598847873329-ed1608fb858b.jpg?v=1784710954',
    publishedAt: '2026-07-22',
    authorName: 'Sonic Selection',
    relatedProducerIds: ['nova-kane'],
    relatedProjectIds: ['artist-collaborations'],
    relatedProductIds: ['nova-kane-vol-1'],
    audioTrackIds: ['nova-kane-preview'],
    content:
      'Vol. 1 started with a single drum loop Nova Kane built at 142 BPM and never intended to release — a rough sketch that ended up defining the whole pack\'s identity: dark, cinematic, built for club systems but mixed with headphones in mind.\n\n' +
      '"I wanted it to sound like a room you walk into at 2am," she says. "Everything after that loop was just chasing that feeling — the 808s, the pads, the little vinyl-crackle textures underneath." The pack took six weeks from that first loop to the final tracklist, most of it spent cutting material that was good but didn\'t belong.\n\n' +
      'Vol. 1 is also Nova Kane\'s first release as part of both the Sonic Selection Artist Series and Female* Producer Collective — two affiliations that show up on her profile, side by side, exactly as they should.',
  },
  {
    id: 'kai-noir-artist-pack-story',
    title: 'Kai Noir: Cold Melodies, Heavy Drums',
    slug: 'kai-noir-cold-melodies-heavy-drums',
    category: 'producer_stories',
    excerpt:
      'Kai Noir on building Vol. 1 around urban drums and cold, cinematic melodies.',
    coverImage:
      'https://cdn.shopify.com/s/files/1/1032/2893/2439/files/photo-1613031729579-ace1feefda4c.jpg?v=1784710979',
    publishedAt: '2026-07-22',
    authorName: 'Sonic Selection',
    relatedProducerIds: ['kai-noir'],
    relatedProjectIds: ['artist-collaborations'],
    relatedProductIds: ['kai-noir-vol-1'],
    audioTrackIds: ['kai-noir-preview'],
    content:
      'Kai Noir builds from the drums out. "If the drums don\'t move on their own, nothing I put on top is going to save it," he says of his process for Vol. 1 — a pack built around heavy, urban-leaning 808 patterns and cold, minor-key melodies that sit somewhere between trap and drill.\n\n' +
      'Every one-shot in the pack was recorded and re-processed at least three times before it made the cut, run through the same signal chain Kai Noir uses on his own placements. "I don\'t release anything I wouldn\'t drop into a session I\'m getting paid for. That\'s the whole standard."\n\n' +
      'Vol. 1 is part of the Sonic Selection Artist Series — the platform-wide artist-collaboration line open to producers across genres, independent of any other project affiliation.',
  },
  {
    id: 'mika-sol-sound-design',
    title: 'Sound Design with Mika Sol',
    slug: 'sound-design-with-mika-sol',
    category: 'sound_design',
    excerpt:
      'Inside the glossy, atmospheric layering behind Mika Sol’s house-leaning sound.',
    coverImage:
      'https://cdn.shopify.com/s/files/1/1032/2893/2439/files/photo-1642177437932-75d846ad48f3.jpg?v=1784711009',
    publishedAt: '2026-07-22',
    authorName: 'Sonic Selection',
    relatedProducerIds: ['mika-sol'],
    relatedProjectIds: ['artist-collaborations'],
    relatedProductIds: ['mika-sol-vol-1'],
    audioTrackIds: ['mika-sol-preview'],
    content:
      'Mika Sol\'s sound starts with layering, not synthesis. "I\'ll take three or four sources — a pad, a field recording, a resampled chord — and blend them until you can\'t point to where one ends and the next begins," she explains. That approach shapes the glossy, atmospheric character running through Vol. 1.\n\n' +
      'House and electronic production usually lean on precision; Mika Sol\'s pack leans into texture instead — slightly detuned layers, soft saturation, reverb tails left a little longer than a mix engineer might recommend. "Perfectly clean can also mean perfectly boring. I want it to feel like it\'s breathing."\n\n' +
      'Vol. 1 sits inside Artist Collaborations, the platform-wide artist-pack line — no project affiliation required beyond being a producer worth featuring.',
  },
  {
    id: 'first-sonic-session-recap',
    title: 'Recap: The First Sonic Session',
    slug: 'recap-first-sonic-session',
    category: 'projects',
    excerpt:
      'Notes, quotes and takeaways from the first Sonic Sessions studio meetup.',
    coverImage:
      'https://cdn.shopify.com/s/files/1/1032/2893/2439/files/photo-1559732277-7453b141e3a1.jpg?v=1784711031',
    publishedAt: '2026-07-22',
    authorName: 'Sonic Selection',
    relatedProducerIds: ['nova-kane', 'kai-noir'],
    relatedProjectIds: ['sonic-sessions', 'workshops-meetings'],
    relatedProductIds: [],
    audioTrackIds: [],
  },
  {
    id: 'free-starter-kit-launch',
    title: 'Start Creating: The Free Starter Kit',
    slug: 'free-starter-kit-launch',
    category: 'free_downloads',
    excerpt:
      'A first look at the free sounds bundled into the Sonic Selection starter kit.',
    coverImage:
      'https://cdn.shopify.com/s/files/1/1032/2893/2439/files/photo-1619078515712-c8e13a3f2d37.jpg?v=1784711291',
    publishedAt: '2026-07-22',
    authorName: 'Sonic Selection',
    relatedProducerIds: [],
    relatedProjectIds: [],
    relatedProductIds: [],
    audioTrackIds: [],
  },
];

export const products: SonicProduct[] = [
  {
    id: 'nova-kane-vol-1',
    shopifyHandle: 'nova-kane-vol-1',
    title: 'Nova Kane Vol. 1',
    type: 'artist_pack',
    price: '39 €',
    coverImage: '/assets/products/nova-kane-vol-1.jpg',
    producerIds: ['nova-kane'],
    projectIds: ['female-producer-collective', 'artist-collaborations'],
    storyIds: ['behind-nova-kane-vol-1'],
    audioTrackIds: ['nova-kane-preview'],
    tags: ['artist-pack', 'trap', 'dark-pop'],
  },
  {
    id: 'kai-noir-vol-1',
    shopifyHandle: 'kai-noir-vol-1',
    title: 'Kai Noir Vol. 1',
    type: 'artist_pack',
    price: '39 €',
    coverImage: '/assets/products/kai-noir-vol-1.jpg',
    producerIds: ['kai-noir'],
    projectIds: ['artist-collaborations'],
    storyIds: ['kai-noir-artist-pack-story'],
    audioTrackIds: ['kai-noir-preview'],
    tags: ['artist-pack', 'trap', 'drill'],
  },
  {
    id: 'mika-sol-vol-1',
    shopifyHandle: 'mika-sol-vol-1',
    title: 'Mika Sol Vol. 1',
    type: 'artist_pack',
    price: '39 €',
    coverImage: '/assets/products/mika-sol-vol-1.jpg',
    producerIds: ['mika-sol'],
    projectIds: ['artist-collaborations'],
    storyIds: ['mika-sol-sound-design'],
    audioTrackIds: ['mika-sol-preview'],
    tags: ['artist-pack', 'house', 'electronic'],
  },
  {
    id: 'lyra-voss-vol-1',
    shopifyHandle: 'lyra-voss-vol-1',
    title: 'Lyra Voss Vol. 1',
    type: 'artist_pack',
    price: '39 €',
    coverImage: '/assets/products/lyra-voss-vol-1.jpg',
    producerIds: ['lyra-voss'],
    projectIds: ['female-producer-collective', 'artist-collaborations'],
    storyIds: [],
    audioTrackIds: ['lyra-voss-preview'],
    tags: ['artist-pack', 'electronic', 'techno'],
  },
  {
    id: 'zay-velar-vol-1',
    shopifyHandle: 'zay-velar-vol-1',
    title: 'Zay Velar Vol. 1',
    type: 'artist_pack',
    price: '39 €',
    coverImage: '/assets/products/zay-velar-vol-1.jpg',
    producerIds: ['zay-velar'],
    projectIds: ['artist-collaborations'],
    storyIds: [],
    audioTrackIds: ['zay-velar-preview'],
    tags: ['artist-pack', 'trap', 'hip-hop'],
  },
  {
    id: 'aria-blaze-vol-1',
    shopifyHandle: 'aria-blaze-vol-1',
    title: 'Aria Blaze Vol. 1',
    type: 'artist_pack',
    price: '39 €',
    coverImage: '/assets/products/aria-blaze-vol-1.jpg',
    producerIds: ['aria-blaze'],
    projectIds: ['artist-collaborations'],
    storyIds: [],
    audioTrackIds: ['aria-blaze-preview'],
    tags: ['artist-pack', 'dark-pop', 'trap'],
  },
  {
    id: 'jet-marrow-vol-1',
    shopifyHandle: 'jet-marrow-vol-1',
    title: 'Jet Marrow Vol. 1',
    type: 'artist_pack',
    price: '39 €',
    coverImage: '/assets/products/jet-marrow-vol-1.jpg',
    producerIds: ['jet-marrow'],
    projectIds: ['artist-collaborations'],
    storyIds: [],
    audioTrackIds: ['jet-marrow-preview'],
    tags: ['artist-pack', 'synthwave', 'electronic'],
  },
  {
    id: 'selene-ray-vol-1',
    shopifyHandle: 'selene-ray-vol-1',
    title: 'Selene Ray Vol. 1',
    type: 'artist_pack',
    price: '39 €',
    coverImage: '/assets/products/selene-ray-vol-1.jpg',
    producerIds: ['selene-ray'],
    projectIds: ['artist-collaborations'],
    storyIds: [],
    audioTrackIds: ['selene-ray-preview'],
    tags: ['artist-pack', 'rnb', 'cinematic'],
  },
  {
    id: 'romeo-vex-vol-1',
    shopifyHandle: 'romeo-vex-vol-1',
    title: 'Romeo Vex Vol. 1',
    type: 'artist_pack',
    price: '39 €',
    coverImage: '/assets/products/romeo-vex-vol-1.jpg',
    producerIds: ['romeo-vex'],
    projectIds: ['artist-collaborations'],
    storyIds: [],
    audioTrackIds: ['romeo-vex-preview'],
    tags: ['artist-pack', 'melodic-trap', 'rnb'],
  },
  {
    id: 'tala-drift-vol-1',
    shopifyHandle: 'tala-drift-vol-1',
    title: 'Tala Drift Vol. 1',
    type: 'artist_pack',
    price: '39 €',
    coverImage: '/assets/products/tala-drift-vol-1.jpg',
    producerIds: ['tala-drift'],
    projectIds: ['artist-collaborations'],
    storyIds: [],
    audioTrackIds: ['tala-drift-preview'],
    tags: ['artist-pack', 'afrobeats', 'amapiano'],
  },
];

export const audioTracks: PlatformAudioTrack[] = [
  {
    id: 'nova-kane-preview',
    title: 'Nova Kane Vol. 1 Preview',
    previewUrl: '/audio/nova-kane-preview.mp3',
    duration: 82,
    bpm: 142,
    key: 'F minor',
    genre: 'Trap',
    mood: 'Dark',
    productId: 'nova-kane-vol-1',
    producerId: 'nova-kane',
    projectId: 'female-producer-collective',
    coverImage: '/assets/products/nova-kane-vol-1.jpg',
  },
  {
    id: 'kai-noir-preview',
    title: 'Kai Noir Vol. 1 Preview',
    previewUrl: '/audio/kai-noir-preview.mp3',
    duration: 74,
    bpm: 148,
    key: 'D minor',
    genre: 'Drill',
    mood: 'Cold',
    productId: 'kai-noir-vol-1',
    producerId: 'kai-noir',
    projectId: 'artist-collaborations',
    coverImage: '/assets/products/kai-noir-vol-1.jpg',
  },
  {
    id: 'mika-sol-preview',
    title: 'Mika Sol Vol. 1 Preview',
    previewUrl: '/audio/mika-sol-preview.mp3',
    duration: 91,
    bpm: 122,
    key: 'A minor',
    genre: 'House',
    mood: 'Glossy',
    productId: 'mika-sol-vol-1',
    producerId: 'mika-sol',
    projectId: 'artist-collaborations',
    coverImage: '/assets/products/mika-sol-vol-1.jpg',
  },
  {
    id: 'lyra-voss-preview',
    title: 'Lyra Voss Vol. 1 Preview',
    previewUrl: '/audio/lyra-voss-preview.mp3',
    duration: 96,
    bpm: 128,
    key: 'C minor',
    genre: 'Techno',
    mood: 'Tense',
    productId: 'lyra-voss-vol-1',
    producerId: 'lyra-voss',
    projectId: 'female-producer-collective',
    coverImage: '/assets/products/lyra-voss-vol-1.jpg',
  },
  {
    id: 'zay-velar-preview',
    title: 'Zay Velar Vol. 1 Preview',
    previewUrl: '/audio/zay-velar-preview.mp3',
    duration: 78,
    bpm: 145,
    key: 'G minor',
    genre: 'Trap',
    mood: 'Hard',
    productId: 'zay-velar-vol-1',
    producerId: 'zay-velar',
    projectId: 'artist-collaborations',
    coverImage: '/assets/products/zay-velar-vol-1.jpg',
  },
  {
    id: 'aria-blaze-preview',
    title: 'Aria Blaze Vol. 1 Preview',
    previewUrl: '/audio/aria-blaze-preview.mp3',
    duration: 88,
    bpm: 138,
    key: 'E minor',
    genre: 'Dark Pop',
    mood: 'Moody',
    productId: 'aria-blaze-vol-1',
    producerId: 'aria-blaze',
    projectId: 'artist-collaborations',
    coverImage: '/assets/products/aria-blaze-vol-1.jpg',
  },
  {
    id: 'jet-marrow-preview',
    title: 'Jet Marrow Vol. 1 Preview',
    previewUrl: '/audio/jet-marrow-preview.mp3',
    duration: 102,
    bpm: 110,
    key: 'B minor',
    genre: 'Synthwave',
    mood: 'Nostalgic',
    productId: 'jet-marrow-vol-1',
    producerId: 'jet-marrow',
    projectId: 'artist-collaborations',
    coverImage: '/assets/products/jet-marrow-vol-1.jpg',
  },
  {
    id: 'selene-ray-preview',
    title: 'Selene Ray Vol. 1 Preview',
    previewUrl: '/audio/selene-ray-preview.mp3',
    duration: 94,
    bpm: 90,
    key: 'A minor',
    genre: 'R&B',
    mood: 'Cinematic',
    productId: 'selene-ray-vol-1',
    producerId: 'selene-ray',
    projectId: 'artist-collaborations',
    coverImage: '/assets/products/selene-ray-vol-1.jpg',
  },
  {
    id: 'romeo-vex-preview',
    title: 'Romeo Vex Vol. 1 Preview',
    previewUrl: '/audio/romeo-vex-preview.mp3',
    duration: 85,
    bpm: 140,
    key: 'F# minor',
    genre: 'Melodic Trap',
    mood: 'Emotional',
    productId: 'romeo-vex-vol-1',
    producerId: 'romeo-vex',
    projectId: 'artist-collaborations',
    coverImage: '/assets/products/romeo-vex-vol-1.jpg',
  },
  {
    id: 'tala-drift-preview',
    title: 'Tala Drift Vol. 1 Preview',
    previewUrl: '/audio/tala-drift-preview.mp3',
    duration: 99,
    bpm: 112,
    key: 'D minor',
    genre: 'Amapiano',
    mood: 'Groovy',
    productId: 'tala-drift-vol-1',
    producerId: 'tala-drift',
    projectId: 'artist-collaborations',
    coverImage: '/assets/products/tala-drift-vol-1.jpg',
  },
];

export function getProjectByHandle(handle: string) {
  return projects.find((project) => project.handle === handle);
}

export function getProducerByHandle(handle: string) {
  return producers.find((producer) => producer.handle === handle);
}

export function getProducerById(id: string) {
  return producers.find((producer) => producer.id === id);
}

export function getStoryBySlug(slug: string) {
  return stories.find((story) => story.slug === slug);
}

/** FPC-affiliation-rules.md: the ONLY correct way to derive project membership. */
export function getProducersByProject(projectId: string) {
  return producers.filter((producer) =>
    producer.affiliations.some((affiliation) => affiliation.projectId === projectId),
  );
}

export function getStoriesByProject(projectId: string) {
  return stories.filter((story) => story.relatedProjectIds.includes(projectId));
}

export function getProductsByProducer(producerId: string) {
  return products.filter((product) => product.producerIds.includes(producerId));
}

export function getProductsByProject(projectId: string) {
  return products.filter((product) => product.projectIds.includes(projectId));
}

export function getStoriesByProducer(producerId: string) {
  return stories.filter((story) => story.relatedProducerIds.includes(producerId));
}

export function getProjectsByIds(projectIds: string[]) {
  return projectIds
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is Project => Boolean(project));
}

export function getProducersByIds(producerIds: string[]) {
  return producerIds
    .map((id) => producers.find((producer) => producer.id === id))
    .filter((producer): producer is Producer => Boolean(producer));
}

export function getAudioTrackById(id: string) {
  return audioTracks.find((track) => track.id === id);
}

export function getAudioTracksByIds(ids: string[]) {
  return ids
    .map((id) => getAudioTrackById(id))
    .filter((track): track is PlatformAudioTrack => Boolean(track));
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getProductsByIds(ids: string[]) {
  return ids
    .map((id) => getProductById(id))
    .filter((product): product is SonicProduct => Boolean(product));
}
