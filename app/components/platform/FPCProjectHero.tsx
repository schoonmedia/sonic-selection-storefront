import type {Project} from '~/lib/platform/types';
import {PlatformCoverImage} from './PlatformCoverImage';

const FPC_MISSION_PILLARS = [
  'Visibility',
  'Education',
  'Community',
  'Mentoring',
  'Workshops',
  'Network',
];

/**
 * Dedicated hero for `/projects/female-producer-collective` — an "FPC x
 * Sonic Selection" lockup plus the mission pillars from
 * claude-master-briefing.md §7. FPC is one flagship project among several
 * (see GlobalProjectHero for the generic template used by every other
 * project); this component intentionally does not get reused for other
 * projects so FPC's flagship framing stays specific to FPC.
 */
export function FPCProjectHero({project}: {project: Project}) {
  return (
    <section className="platform-hero fpc-hero">
      <PlatformCoverImage src={project.heroImage} alt={project.title} className="platform-hero-image" />
      <div className="platform-hero-content">
        <span className="fpc-hero-lockup">Sonic Selection × {project.title}</span>
        <h1 className="platform-hero-title">{project.title}</h1>
        <p className="platform-hero-description">{project.description}</p>
        <ul className="fpc-mission-pillars">
          {FPC_MISSION_PILLARS.map((pillar) => (
            <li key={pillar} className="fpc-mission-pillar">
              {pillar}
            </li>
          ))}
        </ul>
        <div className="platform-hero-cta-row">
          <a className="platform-hero-cta" href="/producers">
            Explore producers
          </a>
          <a className="platform-hero-cta platform-hero-cta--outline" href="/stories">
            Read stories
          </a>
        </div>
      </div>
    </section>
  );
}
