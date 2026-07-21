import iconSound from '~/assets/icons/icon-sound.svg';
import iconHeadphones from '~/assets/icons/icon-headphones.svg';
import iconRoyaltyFree from '~/assets/icons/icon-royalty-free.svg';
import iconDownload from '~/assets/icons/icon-download.svg';

const FEATURES = [
  {
    icon: iconSound,
    title: 'High Quality Sounds',
    subtitle: 'Professionally crafted',
  },
  {
    icon: iconHeadphones,
    title: 'Producer Focused',
    subtitle: 'Made for your workflow',
  },
  {
    icon: iconRoyaltyFree,
    title: 'Royalty Free',
    subtitle: 'Use in your projects',
  },
  {
    icon: iconDownload,
    title: 'Instant Download',
    subtitle: 'Get sounds immediately',
  },
] as const;

/** Static 4-up trust row below the hero, matching the brand-kit mockup. */
export function FeatureIconsRow() {
  return (
    <section className="feature-icons-row" aria-label="Why Sonic Selection">
      {FEATURES.map((feature) => (
        <div className="feature-icon-item" key={feature.title}>
          <img src={feature.icon} alt="" width={40} height={40} />
          <div>
            <p className="feature-icon-title">{feature.title}</p>
            <p className="feature-icon-subtitle">{feature.subtitle}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
