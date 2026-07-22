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
 * Architecture" briefing package. Image/audio paths below are placeholders
 * (`/assets/...`, `/audio/...`) that intentionally do not resolve to real
 * files yet — real photography, cover art and audio previews are a separate,
 * later task (see docs/platform/README.md). Every component that renders
 * these fields (PlatformCoverImage, PlatformPlayButton) degrades gracefully
 * when the file 404s, so this is safe to ship as-is.
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
    heroImage: '/assets/projects/fpc-hero.jpg',
    logoImage: '/assets/logos/fpc-logo.svg',
    relatedProducerIds: ['nova-kane'],
    relatedStoryIds: ['inside-fpc', 'producer-visibility-matters'],
    relatedProductIds: ['nova-kane-vol-1'],
    audioTrackIds: ['nova-kane-preview'],
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
    heroImage: '/assets/projects/artist-series-hero.jpg',
    relatedProducerIds: ['kai-noir', 'mika-sol', 'nova-kane'],
    relatedStoryIds: ['behind-nova-kane-vol-1', 'kai-noir-artist-pack-story', 'mika-sol-sound-design'],
    relatedProductIds: ['kai-noir-vol-1', 'mika-sol-vol-1', 'nova-kane-vol-1'],
    audioTrackIds: ['kai-noir-preview', 'mika-sol-preview', 'nova-kane-preview'],
  },
  {
    id: 'sonic-sessions',
    title: 'Sonic Sessions',
    handle: 'sonic-sessions',
    type: 'session',
    shortDescription: 'Live and recorded studio sessions from Sonic Selection producers.',
    description:
      'Sonic Sessions documents producers at work — studio recaps, session breakdowns and the stories behind how a pack came together.',
    heroImage: '/assets/projects/sonic-sessions-hero.jpg',
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
    heroImage: '/assets/projects/community-drops-hero.jpg',
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
    heroImage: '/assets/projects/workshops-hero.jpg',
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
    heroImage: '/assets/projects/education-resources-hero.jpg',
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
    coverImage: '/assets/stories/inside-fpc.jpg',
    publishedAt: '2026-07-22',
    authorName: 'Sonic Selection',
    relatedProducerIds: ['nova-kane'],
    relatedProjectIds: ['female-producer-collective'],
    relatedProductIds: [],
    audioTrackIds: [],
  },
  {
    id: 'producer-visibility-matters',
    title: 'Why Producer Visibility Matters',
    slug: 'why-producer-visibility-matters',
    category: 'industry_culture',
    excerpt:
      'Producer culture is bigger than credits. Visibility shapes careers, collaborations and access.',
    coverImage: '/assets/stories/producer-visibility.jpg',
    publishedAt: '2026-07-22',
    authorName: 'Sonic Selection',
    relatedProducerIds: ['nova-kane', 'kai-noir'],
    relatedProjectIds: ['female-producer-collective'],
    relatedProductIds: [],
    audioTrackIds: [],
  },
  {
    id: 'behind-nova-kane-vol-1',
    title: 'Behind the Pack: Nova Kane Vol. 1',
    slug: 'behind-nova-kane-vol-1',
    category: 'behind_the_pack',
    excerpt:
      'A look into the sonic identity behind Nova Kane’s first Sonic Selection artist pack.',
    coverImage: '/assets/stories/behind-nova-kane.jpg',
    publishedAt: '2026-07-22',
    authorName: 'Sonic Selection',
    relatedProducerIds: ['nova-kane'],
    relatedProjectIds: ['artist-collaborations'],
    relatedProductIds: ['nova-kane-vol-1'],
    audioTrackIds: ['nova-kane-preview'],
  },
  {
    id: 'kai-noir-artist-pack-story',
    title: 'Kai Noir: Cold Melodies, Heavy Drums',
    slug: 'kai-noir-cold-melodies-heavy-drums',
    category: 'producer_stories',
    excerpt:
      'Kai Noir on building Vol. 1 around urban drums and cold, cinematic melodies.',
    coverImage: '/assets/stories/kai-noir-story.jpg',
    publishedAt: '2026-07-22',
    authorName: 'Sonic Selection',
    relatedProducerIds: ['kai-noir'],
    relatedProjectIds: ['artist-collaborations'],
    relatedProductIds: ['kai-noir-vol-1'],
    audioTrackIds: ['kai-noir-preview'],
  },
  {
    id: 'mika-sol-sound-design',
    title: 'Sound Design with Mika Sol',
    slug: 'sound-design-with-mika-sol',
    category: 'sound_design',
    excerpt:
      'Inside the glossy, atmospheric layering behind Mika Sol’s house-leaning sound.',
    coverImage: '/assets/stories/mika-sol-story.jpg',
    publishedAt: '2026-07-22',
    authorName: 'Sonic Selection',
    relatedProducerIds: ['mika-sol'],
    relatedProjectIds: ['artist-collaborations'],
    relatedProductIds: ['mika-sol-vol-1'],
    audioTrackIds: ['mika-sol-preview'],
  },
  {
    id: 'first-sonic-session-recap',
    title: 'Recap: The First Sonic Session',
    slug: 'recap-first-sonic-session',
    category: 'projects',
    excerpt:
      'Notes, quotes and takeaways from the first Sonic Sessions studio meetup.',
    coverImage: '/assets/stories/sonic-session-recap.jpg',
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
    coverImage: '/assets/stories/free-starter-kit.jpg',
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
];

export function getProjectByHandle(handle: string) {
  return projects.find((project) => project.handle === handle);
}

export function getProducerByHandle(handle: string) {
  return producers.find((producer) => producer.handle === handle);
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
