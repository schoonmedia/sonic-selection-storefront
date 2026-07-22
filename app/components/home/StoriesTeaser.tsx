import {Link} from 'react-router';
import {stories} from '~/lib/platform/mockData';
import {StoryGrid} from '~/components/platform/StoryGrid';

/** Home template §7 "Stories teaser" module — platform-wide editorial hub. */
export function StoriesTeaser() {
  if (stories.length === 0) return null;

  return (
    <section className="home-section" aria-labelledby="stories-heading">
      <div className="section-header">
        <h2 id="stories-heading">Stories</h2>
        <Link className="section-view-all" to="/stories" prefetch="intent">
          View all →
        </Link>
      </div>
      <StoryGrid stories={stories.slice(0, 3)} />
    </section>
  );
}
