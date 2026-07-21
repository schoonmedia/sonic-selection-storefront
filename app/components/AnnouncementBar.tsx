import {useState} from 'react';
import {Link} from 'react-router';

/**
 * Slim promo strip shown above the header on every page, per the official
 * homepage mockup (docs/brand-assets/references/reference-shopify-layout.png).
 * Dismissible client-side only — no persistence, so it reappears on the next
 * page load/visit by design (it's meant to advertise the current release).
 */
export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="announcement-bar" role="note">
      <p className="announcement-bar-text">
        <span className="announcement-bar-badge" aria-hidden="true">
          S
        </span>
        <strong>New Release:</strong> Dark Trap Vol. 5 — Out Now
        <Link className="announcement-bar-link" to="/collections/bundles" prefetch="intent">
          Explore Now →
        </Link>
      </p>
      <button
        className="announcement-bar-close reset"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
      >
        ✕
      </button>
    </div>
  );
}
