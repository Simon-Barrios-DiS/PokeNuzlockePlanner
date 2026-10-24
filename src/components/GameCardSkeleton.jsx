export default function GameCardSkeleton() {
  return (
    <article className="game-card game-card--skeleton" aria-hidden="true">
      <div className="game-card-head">
        <span className="skeleton skeleton-line skeleton-line--xs" />
        <span className="skeleton skeleton-line skeleton-line--xs" />
      </div>
      <span className="skeleton skeleton-line skeleton-line--md" />
      <span className="skeleton skeleton-line skeleton-line--sm" />
      <div className="game-card-tags">
        <span className="skeleton skeleton-badge" />
        <span className="skeleton skeleton-badge skeleton-badge--short" />
      </div>
      <div className="game-card-footer">
        <span className="skeleton skeleton-line skeleton-line--xs" />
        <span className="skeleton skeleton-line skeleton-line--xs" />
      </div>
    </article>
  );
}
