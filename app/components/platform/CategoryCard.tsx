import {Link} from 'react-router';

export function CategoryCard({
  title,
  description,
  href,
  count,
}: {
  title: string;
  description?: string;
  href: string;
  count?: number;
}) {
  return (
    <Link to={href} className="platform-category-card" prefetch="intent">
      <span className="platform-category-card-title">{title}</span>
      {description && <span className="platform-category-card-description">{description}</span>}
      {typeof count === 'number' && (
        <span className="platform-category-card-count">
          {count} {count === 1 ? 'Story' : 'Stories'}
        </span>
      )}
    </Link>
  );
}
