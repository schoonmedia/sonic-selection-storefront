import {Link} from 'react-router';
import type {Project} from '~/lib/platform/types';
import {PlatformCoverImage} from './PlatformCoverImage';

const PROJECT_TYPE_LABEL: Record<Project['type'], string> = {
  flagship_project: 'Flagship Project',
  collective: 'Collective',
  session: 'Sessions',
  community_drop: 'Community Drop',
  artist_collaboration: 'Artist Collaboration',
  workshop: 'Workshop',
  meeting: 'Meeting',
  education: 'Education',
  resources: 'Resources',
};

export function ProjectCard({project}: {project: Project}) {
  return (
    <Link to={`/projects/${project.handle}`} className="project-card" prefetch="intent">
      <PlatformCoverImage
        src={project.heroImage}
        alt={project.title}
        className="project-card-image"
      />
      <div className="project-card-body">
        <span className="platform-eyebrow">{PROJECT_TYPE_LABEL[project.type]}</span>
        <h3 className="project-card-title">{project.title}</h3>
        <p className="project-card-description">{project.shortDescription}</p>
      </div>
    </Link>
  );
}
