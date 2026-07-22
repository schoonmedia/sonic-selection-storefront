import type {Project} from '~/lib/platform/types';
import {ProjectCard} from './ProjectCard';

export function ProjectGrid({projects}: {projects: Project[]}) {
  if (projects.length === 0) {
    return <p className="platform-empty-state">No projects to show yet.</p>;
  }

  return (
    <div className="project-grid">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
