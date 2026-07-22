import type {Producer} from '~/lib/platform/types';

const SOCIAL_LABELS: Record<keyof NonNullable<Producer['socialLinks']>, string> = {
  instagram: 'Instagram',
  spotify: 'Spotify',
  soundcloud: 'SoundCloud',
  youtube: 'YouTube',
  website: 'Website',
};

export function ProducerSocialLinks({links}: {links?: Producer['socialLinks']}) {
  if (!links) return null;
  const entries = (Object.keys(SOCIAL_LABELS) as (keyof typeof SOCIAL_LABELS)[])
    .map((key) => ({key, url: links[key]}))
    .filter((entry): entry is {key: keyof typeof SOCIAL_LABELS; url: string} => Boolean(entry.url));

  if (entries.length === 0) return null;

  return (
    <div className="producer-social-links">
      {entries.map(({key, url}) => (
        <a key={key} href={url} target="_blank" rel="noreferrer" className="producer-social-link">
          {SOCIAL_LABELS[key]}
        </a>
      ))}
    </div>
  );
}
