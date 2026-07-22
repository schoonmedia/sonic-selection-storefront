import type {Story} from '~/lib/platform/types';
import {getStoryCategoryLabel} from '~/lib/platform/storyCategories';
import {PlatformCoverImage} from './PlatformCoverImage';

export function StoryHero({story}: {story: Story}) {
  const publishedDate = new Date(story.publishedAt);
  const formattedDate = Number.isNaN(publishedDate.getTime())
    ? story.publishedAt
    : publishedDate.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});

  return (
    <section className="platform-hero story-hero">
      <PlatformCoverImage src={story.coverImage} alt={story.title} className="platform-hero-image" />
      <div className="platform-hero-content">
        <span className="story-card-category story-hero-category">
          {getStoryCategoryLabel(story.category)}
        </span>
        <h1 className="platform-hero-title">{story.title}</h1>
        <p className="platform-hero-description">{story.excerpt}</p>
        <span className="story-hero-meta">
          {story.authorName ? `${story.authorName} · ` : ''}
          {formattedDate}
        </span>
      </div>
    </section>
  );
}
