import {useLoaderData} from 'react-router';
import type {Route} from './+types/projects._index';
import {projects, getProjectByHandle} from '~/lib/platform/mockData';
import {ProjectCard} from '~/components/platform/ProjectCard';
import {ProjectGrid} from '~/components/platform/ProjectGrid';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Sonic Selection | Projects'}];
};

/**
 * Global projects hub. FPC is surfaced as the featured project (it's an
 * official flagship project — see architecture-correction.md) but is one
 * entry in this list, not its parent or its only content.
 */
export async function loader(_args: Route.LoaderArgs) {
  const featuredProject = getProjectByHandle('female-producer-collective');
  const otherProjects = projects.filter((project) => project.id !== featuredProject?.id);

  return {featuredProject, otherProjects};
}

export default function ProjectsIndex() {
  const {featuredProject, otherProjects} = useLoaderData<typeof loader>();

  return (
    <div className="platform-page">
      <section className="platform-hero platform-hero--compact">
        <div className="platform-hero-content">
          <h1 className="platform-hero-title">Projects</h1>
          <p className="platform-hero-description">
            Collaborations, community formats and flagship initiatives by Sonic Selection.
          </p>
        </div>
      </section>

      {featuredProject && (
        <section className="platform-section">
          <span className="platform-eyebrow">Featured Project</span>
          <ProjectCard project={featuredProject} />
        </section>
      )}

      <section className="platform-section">
        <h2 className="platform-section-title">All Projects</h2>
        <ProjectGrid projects={otherProjects} />
      </section>
    </div>
  );
}
