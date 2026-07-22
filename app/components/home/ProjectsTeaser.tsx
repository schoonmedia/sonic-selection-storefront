import {Link} from 'react-router';
import {projects, getProjectByHandle} from '~/lib/platform/mockData';
import {ProjectGrid} from '~/components/platform/ProjectGrid';
import {PlatformCoverImage} from '~/components/platform/PlatformCoverImage';

/**
 * Home template §7 "Projects teaser" + "FPC flagship project teaser" —
 * combined into one section: a dedicated FPC highlight banner (giving the
 * flagship project strong home page visibility per architecture-
 * correction.md) followed by the rest of the projects grid. FPC is
 * highlighted here as ONE featured project, not as the parent of this list.
 */
export function ProjectsTeaser() {
  const fpc = getProjectByHandle('female-producer-collective');
  const otherProjects = projects.filter((project) => project.id !== fpc?.id).slice(0, 3);

  return (
    <section className="home-section" aria-labelledby="projects-heading">
      <div className="section-header">
        <h2 id="projects-heading">Projects</h2>
        <Link className="section-view-all" to="/projects" prefetch="intent">
          View all →
        </Link>
      </div>

      {fpc && (
        <Link to={`/projects/${fpc.handle}`} className="fpc-flagship-banner" prefetch="intent">
          <PlatformCoverImage
            src={fpc.heroImage}
            alt={fpc.title}
            className="fpc-flagship-banner-image"
          />
          <div className="fpc-flagship-banner-content">
            <span className="platform-eyebrow">Flagship Project</span>
            <h3 className="fpc-flagship-banner-title">{fpc.title}</h3>
            <p className="fpc-flagship-banner-description">{fpc.shortDescription}</p>
          </div>
        </Link>
      )}

      {otherProjects.length > 0 && <ProjectGrid projects={otherProjects} />}
    </section>
  );
}
