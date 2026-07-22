import type {Story} from '~/lib/platform/types';
import {StoryCard} from './StoryCard';

export function StoryGrid({stories}: {stories: Story[]}) {
  if (stories.length === 0) {
    return <p className="platform-empty-state">No stories to show yet.</p>;
  }

  return (
    <div className="story-grid">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  );
}
