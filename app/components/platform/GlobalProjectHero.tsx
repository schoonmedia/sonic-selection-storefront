import type {Project} from '~/lib/platform/types';
import {PlatformCoverImage} from './PlatformCoverImage';

/**
 * Generic project hero, used for every project detail page EXCEPT
 * `/projects/female-producer-collective`, which uses `FPCProjectHero`
 * instead (see architecture-correction.md — FPC gets its own hero to give
 * it visible flagship status, without making it the template for the
 * generic project system). Also used as the `/projects` index hero.
 */
export function GlobalProjectHero({
  title,
  description,
  image,
  cta,
}: {
  title: string;
  description: string;
  image?: string;
  cta?: {label: string; href: string};
}) {
  return (
    <section className="platform-hero">
      <PlatformCoverImage src={image} alt={title} className="platform-hero-image" />
      <div className="platform-hero-content">
        <h1 className="platform-hero-title">{title}</h1>
        <p className="platform-hero-description">{description}</p>
        {cta && (
          <a className="platform-hero-cta" href={cta.href}>
            {cta.label}
          </a>
        )}
      </div>
    </section>
  );
}
