import {Link} from 'react-router';
import {PlatformCoverImage} from './PlatformCoverImage';

export function CategoryCard({
  title,
  description,
  href,
  count,
  image,
}: {
  title: string;
  description?: string;
  href: string;
  count?: number;
  image?: string;
}) {
  return (
    <Link to={href} className="platform-category-card" prefetch="intent">
      {image && (
        <div className="platform-category-card-image-wrap">
          <PlatformCoverImage src={image} alt="" className="platform-category-card-image" />
        </div>
      )}
      <div className="platform-category-card-body">
        <span className="platform-category-card-title">{title}</span>
        {description && <span className="platform-category-card-description">{description}</span>}
        {typeof count === 'number' && (
          <span className="platform-category-card-count">
            {count} {count === 1 ? 'Story' : 'Stories'}
          </span>
        )}
      </div>
    </Link>
  );
}
