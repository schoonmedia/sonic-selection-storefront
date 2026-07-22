import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/stories._index';
import {stories} from '~/lib/platform/mockData';
import {STORY_CATEGORIES, getStoryCategoryLabel} from '~/lib/platform/storyCategories';
import type {StoryCategory} from '~/lib/platform/types';
import {StoryGrid} from '~/components/platform/StoryGrid';
import {CategoryCard} from '~/components/platform/CategoryCard';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Sonic Selection | Stories'}];
};

/** Global editorial hub — stories are platform-wide, not nested under any project. */
export async function loader({request}: Route.LoaderArgs) {
  const activeCategory = new URL(request.url).searchParams.get('category') as StoryCategory | null;
  const filteredStories = activeCategory
    ? stories.filter((story) => story.category === activeCategory)
    : stories;

  return {stories: filteredStories, activeCategory};
}

export default function StoriesIndex() {
  const {stories: allStories, activeCategory} = useLoaderData<typeof loader>();

  return (
    <div className="platform-page">
      <section className="platform-hero platform-hero--compact">
        <div className="platform-hero-content">
          <h1 className="platform-hero-title">Stories from producer culture.</h1>
          <p className="platform-hero-description">
            Producer stories, industry perspectives and behind-the-pack features.
          </p>
        </div>
      </section>

      <section className="platform-section">
        <h2 className="platform-section-title">Categories</h2>
        <div className="platform-category-grid">
          {STORY_CATEGORIES.map((category) => (
            <CategoryCard
              key={category.value}
              title={category.label}
              description={category.description}
              href={`/stories?category=${category.value}`}
              count={stories.filter((story) => story.category === category.value).length}
            />
          ))}
        </div>
      </section>

      <section className="platform-section">
        <h2 className="platform-section-title">
          {activeCategory ? getStoryCategoryLabel(activeCategory) : 'All Stories'}
        </h2>
        {activeCategory && (
          <Link to="/stories" className="genre-filter-clear" prefetch="intent">
            Clear filter
          </Link>
        )}
        <StoryGrid stories={allStories} />
      </section>
    </div>
  );
}
