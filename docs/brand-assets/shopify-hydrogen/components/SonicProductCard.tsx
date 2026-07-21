export type SonicProductCardProps = {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  price?: string;
  badge?: string;
  onPlay?: () => void;
};

export function SonicProductCard({title, subtitle, imageUrl, price, badge, onPlay}: SonicProductCardProps) {
  return (
    <article className="ss-card ss-product-card">
      <div className="ss-product-card__media">
        {badge ? <span className="ss-product-card__badge">{badge}</span> : null}
        {imageUrl ? <img src={imageUrl} alt="" loading="lazy" /> : <div className="ss-product-card__placeholder" />}
        <button type="button" className="ss-product-card__play" onClick={onPlay} aria-label={`Play preview for ${title}`}>
          ▶
        </button>
      </div>
      <div className="ss-product-card__content">
        <h3>{title}</h3>
        {subtitle ? <p>{subtitle}</p> : null}
        {price ? <strong>{price}</strong> : null}
      </div>
    </article>
  );
}
