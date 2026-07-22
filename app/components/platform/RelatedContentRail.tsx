import {Link} from 'react-router';
import {PlatformCoverImage} from './PlatformCoverImage';

export interface RelatedContentItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  href: string;
}

/**
 * Generic horizontal rail used for "related producers / stories / products"
 * sections across producer, project and story detail pages. Callers map
 * their domain objects (Producer, Story, SonicProduct, Project) into
 * RelatedContentItem — this component itself has no knowledge of those
 * types, which is what lets one component cover all three relation kinds
 * per components-plan.md.
 */
export function RelatedContentRail({
  title,
  items,
}: {
  title: string;
  items: RelatedContentItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="related-content-rail">
      <h3 className="related-content-rail-title">{title}</h3>
      <div className="related-content-rail-track">
        {items.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            className="related-content-rail-item"
            prefetch="intent"
          >
            <PlatformCoverImage
              src={item.image}
              alt={item.title}
              className="related-content-rail-image"
            />
            <span className="related-content-rail-item-title">{item.title}</span>
            {item.subtitle && (
              <span className="related-content-rail-item-subtitle">{item.subtitle}</span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
