import type {ProjectAffiliation} from '~/lib/platform/types';

/**
 * Renders ONLY from explicit affiliation data (see
 * rules/fpc-affiliation-rules.md) — never infer membership from name, image,
 * genre or bio text. If a producer has no `female-producer-collective`
 * affiliation entry, this badge must not render one.
 */
export function AffiliationBadge({affiliation}: {affiliation: ProjectAffiliation}) {
  return (
    <span
      className={`affiliation-badge ${affiliation.isPrimary ? 'affiliation-badge--primary' : ''}`}
    >
      {affiliation.label}
    </span>
  );
}

export function AffiliationBadgeList({affiliations}: {affiliations: ProjectAffiliation[]}) {
  if (affiliations.length === 0) return null;
  return (
    <div className="affiliation-badge-list">
      {affiliations.map((affiliation) => (
        <AffiliationBadge key={affiliation.projectId} affiliation={affiliation} />
      ))}
    </div>
  );
}
