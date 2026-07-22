import {Link} from 'react-router';
import type {Story} from '~/lib/platform/types';
import {getAudioTrackById} from '~/lib/platform/mockData';
import {getStoryCategoryLabel} from '~/lib/platform/storyCategories';
import {PlatformCoverImage} from './PlatformCoverImage';
import {PlatformPlayButton} from './PlatformPlayButton';

export function StoryCard({story}: {story: Story}) {
  const previewTrack = story.audioTrackIds.map((id) => getAudioTrackById(id)).find(Boolean);

  return (
    <article className="story-card">
      <Link to={`/stories/${story.slug}`} className="story-card-media" prefetch="intent">
        <PlatformCoverImage src={story.coverImage} alt={story.title} className="story-card-image" />
        <span className="story-card-category">{getStoryCategoryLabel(story.category)}</span>
      </Link>
      <div className="story-card-body">
        <Link to={`/stories/${story.slug}`} className="story-card-title" prefetch="intent">
          {story.title}
        </Link>
        <p className="story-card-excerpt">{story.excerpt}</p>
        {story.authorName && <span className="story-card-meta">{story.authorName}</span>}
      </div>
      <PlatformPlayButton track={previewTrack} contextTitle={story.title} size="sm" />
    </article>
  );
}
